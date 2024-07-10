import json
from datetime import datetime
from Core import schemas, models
from Utilities.feedback import (get_chatbot_response,
                                get_chatbot_comment,
                                calculate_metrics)
from Utilities.llm import LLM
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List


def get_llm_dict(db: Session):
    llm_dict = {}
    data = db.query(models.AIModel).all()
    if not data:
        raise HTTPException(
            status_code=404,
            detail="LLMs data not found."
        )
    for model in data:
        llm_instance = LLM(name=model.name,
                           url=model.url)
        llm_dict[model.llm_id] = llm_instance
    return llm_dict


def get_llm_list(db: Session):
    data = db.query(models.AIModel).all()
    if not data:
        raise HTTPException(
            status_code=404,
            detail="LLMs data not found."
        )
    llm_list: List[schemas.LLM] = [
        schemas.LLM(llm_id=llm.llm_id,
                    name=llm.name)
        for llm in data
    ]
    return llm_list


def create_new_conversation(db: Session,
                            user_id: int,
                            llm_id: int):
    try:
        created_at = datetime.now()
        new_conversation = models.Conversation(
            title="Untitled",
            user_id=user_id,
            llm_id=llm_id,
            created_at=created_at
        )
        db.add(new_conversation)
        db.commit()
        db.refresh(new_conversation)
        return schemas.Conversation(
            conversation_id=new_conversation.conversation_id,
            user_id=new_conversation.user_id,
            title=new_conversation.title,
            llm_id=new_conversation.llm_id,
            created_at=created_at.strftime('%Y-%m-%d %H:%M:%S')
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {e}"
        )


def delete_conversation(db: Session,
                        conversation_id: int,
                        user_id: int) -> str:
    try:
        conversation = (
            db.query(models.Conversation)
            .filter_by(conversation_id=conversation_id)
            .first()
        )
        if not conversation:
            raise HTTPException(
                status_code=404,
                detail=f"Conversation with ID {conversation_id} not found."
            )
        db.query(models.Feedback).filter(
            models.Feedback.feedback_id.in_(
                db.query(models.Message.feedback_id)
                .filter_by(conversation_id=conversation_id)
            )
        ).delete(synchronize_session=False)

        db.query(models.Message).filter_by(
            conversation_id=conversation_id
        ).delete(synchronize_session=False)

        db.query(models.Conversation).filter_by(
            conversation_id=conversation_id
        ).delete(synchronize_session=False)

        db.commit()
        return f"Conversation with ID {conversation_id} deleted successfully."
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def get_all_conversations(db: Session,
                          user_id: int) -> list[schemas.Conversation]:
    try:
        conversations = (
            db.query(models.Conversation)
            .filter_by(user_id=user_id)
            .all()
        )
        if not conversations:
            return []
        return [
            schemas.Conversation(
                conversation_id=conversation.conversation_id,
                title=conversation.title,
                user_id=conversation.user_id,
                llm_id=conversation.llm_id,
                created_at=conversation.created_at
            )
            for conversation in conversations
        ]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


async def send_query(db: Session,
                     conversation_id: int,
                     query: schemas.Query,
                     user_id: int):
    if not query.query_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty")
    try:
        request_created_at = datetime.now()
        conversation = (
            db.query(models.Conversation)
            .filter_by(conversation_id=conversation_id)
            .first()
        )
        if not conversation:
            raise HTTPException(
                status_code=404,
                detail=f"Conversation with ID {conversation_id} not found.")
        llm_id = conversation.llm_id
        if not query.task_id:
            task = ""
        else:
            task = (db.query(models.Task)
                    .filter_by(task_id=query.task_id)
                    .first())
            if not task:
                raise HTTPException(
                    status_code=404,
                    detail=f"Task with ID {query.task_id} not found.")
        comment = await get_chatbot_comment(
            query=query.query_text,
            task=task,
            llm_id=llm_id
        )
        metrics = await calculate_metrics(
            query=query.query_text,
            task=task,
            llm_id=llm_id
        )
        response = await get_chatbot_response(
            query=query.query_text,
            llm_id=llm_id
        )
        response_created_at = datetime.now()
        
        feedback = models.Feedback(
            comment=comment,
            metrics=metrics
        )
        db.add(feedback)
        db.commit()
        request_message = models.Message(
            conversation_id=conversation_id,
            message_class='Request',
            content=query.query_text,
            task_id=query.task_id,
            feedback_id=feedback.feedback_id,
            created_at=request_created_at
        )
        db.add(request_message)
        db.commit()
        response_message = models.Message(
            conversation_id=conversation_id,
            message_class='Response',
            content=response,
            task_id=query.task_id,
            feedback_id=feedback.feedback_id,
            created_at=response_created_at
        )
        db.add(response_message)
        db.commit()
        entire_response = schemas.EntireResponse(
            conversation_id=conversation_id,
            query_id=request_message.message_id,
            response_id=response_message.message_id,
            response_text=response,
            comment=comment,
            metrics=metrics
        )
        return entire_response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def get_task_by_id(db: Session,
                   task_id: int) -> schemas.Task:
    try:
        task = (
            db.query(models.Task)
            .filter(models.Task.task_id == task_id)
            .first()
        )
        if not task:
            raise HTTPException(status_code=404,
                                detail=f"Task with ID {task_id} not found.")
        return schemas.Task(
            task_id=task_id,
            task_name=task.task_name,
            category=task.task_category,
            description=task.task_description
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def get_all_messages_by_conversation_id(
        db: Session, conversation_id: int) -> List[schemas.Message]:
    try:
        conversation = (
            db.query(models.Conversation)
            .filter(models.Conversation.conversation_id == conversation_id)
            .first()
        )
        if not conversation:
            error_msg = f"Conversation with ID {conversation_id} not found."
            raise HTTPException(status_code=404,
                                detail=error_msg)
        messages = (
            db.query(models.Message)
            .filter(models.Message.conversation_id == conversation_id)
            .all()
        )
        message_schemas = [
            schemas.Message(
                message_id=message.message_id,
                message_class=message.message_class,
                content=message.content,
                feedback_id=message.feedback_id
            ) for message in messages
        ]
        return message_schemas
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def get_feedback_by_query_id(db: Session,
                             query_id: int) -> schemas.Feedback:
    try:
        message = (
            db.query(models.Message)
            .filter(models.Message.message_id == query_id)
            .first()
        )
        if not message:
            error_msg = f"Request with ID {query_id} not found."
            raise HTTPException(status_code=404,
                                detail=error_msg)
        feedback = (
            db.query(models.Feedback)
            .filter(models.Feedback.feedback_id == message.feedback_id)
            .first()
        )
        if not feedback:
            error_msg = f"Feedback for request with ID {query_id} not found."
            raise HTTPException(status_code=404,
                                detail=error_msg)
        metrics = feedback.metrics
        if isinstance(metrics, str):
            metrics = json.loads(metrics)
        feedback_schema = schemas.Feedback(
            feedback_id=feedback.feedback_id,
            comment=feedback.comment,
            metrics=metrics
        )
        return feedback_schema

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def calculate_personal_statistics(db: Session,
                                  user_id: int) -> schemas.PersonalStatistics:
    try:
        avg_metrics_query = db.query(
            func.round(func.avg(
                func.json_extract(
                    models.Feedback.metrics, '$.criterion_1')), 1
                        ).label('criterion_1'),
            func.round(func.avg(
                func.json_extract(
                    models.Feedback.metrics, '$.criterion_2')), 1
                        ).label('criterion_2'),
            func.round(func.avg(
                func.json_extract(
                    models.Feedback.metrics, '$.criterion_3')), 1
                        ).label('criterion_3'),
            func.round(func.avg(
                func.json_extract(
                    models.Feedback.metrics, '$.criterion_4')), 1
                        ).label('criterion_4')
        ).join(
            models.Message,
            models.Message.feedback_id == (
                models.Feedback.feedback_id)
        ).join(
            models.Conversation,
            models.Conversation.conversation_id == (
                models.Message.conversation_id)
        ).filter(
            models.Conversation.user_id == (
                user_id),
            models.Message.message_class == (
                'Request')
        ).first()
        if not avg_metrics_query:
            raise HTTPException(
                status_code=404,
                detail=f"Personal statistics not found for user ID {user_id}."
            )
        avg_metrics = avg_metrics_query._asdict()
        metrics = {k: v if v is not None
                   else 0 for k, v in avg_metrics.items()}
        total_activity_query = db.query(
            func.count(
                models.Conversation.conversation_id
                    ).label('total_conversations'),
            func.count(
                models.Message.message_id
                    ).label('total_messages'),
            func.count(
                func.distinct(models.Message.task_id)
                    ).label('task_ids')
        ).join(
            models.Message,
            models.Message.conversation_id == (
                models.Conversation.conversation_id)
        ).filter(
            models.Conversation.user_id == (
                user_id),
            models.Message.message_class == (
                'Request')
        ).first()
        if not total_activity_query:
            raise HTTPException(
                status_code=404,
                detail=f"Total activity not found for user ID {user_id}."
            )
        total_activity = {
            "total_queries": total_activity_query.total_conversations,
            "total_conversations": total_activity_query.total_messages,
            "tasks_solved": total_activity_query.task_ids
        }
        daily_activity_query = db.query(
            models.Message.created_at.label('message_date'),
            func.count(models.Message.message_id).label('daily_message_count')
        ).join(
            models.Conversation,
            models.Conversation.conversation_id == (
                models.Message.conversation_id)
        ).filter(
            models.Conversation.user_id == (
                user_id),
            models.Message.message_class == (
                'Request')
        ).group_by(
            models.Message.created_at
        ).order_by(
            'message_date'
        ).all()
        if not daily_activity_query:
            error_msg = f"Daily activity not found for user ID {user_id}."
            raise HTTPException(status_code=404,
                                detail=error_msg)
        daily_activity: List[Dict[str, Any]] = [
            {"date": row.message_date.strftime('%Y-%m-%d %H:%M:%S'),
             "number_of_queries": row.daily_message_count}
            for row in daily_activity_query
        ]
        return schemas.PersonalStatistics(metrics=metrics,
                                          total_activity=total_activity,
                                          daily_activity=daily_activity)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
