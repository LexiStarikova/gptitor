import sqlite3
from datetime import datetime
from fastapi import (HTTPException, Depends,)
from typing import List
from Core.schemas import Query, Conversation, EntireResponse, Metrics, Task, Message
from Utilities.feedback import *
import json

db_file = "gptitor.db"

def create_new_conversation(user_id: int, llm_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        sql_insert = '''INSERT INTO conversations (title, user_id, llm_id, created_at)
                         VALUES (?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, ("Untitled", user_id, llm_id, created_at))
        conn.commit() 
        conversation = Conversation(user_id=user_id, 
                                    conversation_id=cursor.lastrowid,
                                    llm_id=llm_id,
                                    created_at=created_at
                                    )
        return conversation
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def delete_conversation(conversation_id: int, user_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    
        cursor.execute("SELECT * FROM conversations WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if conversation:
            cursor.execute("""
                DELETE FROM feedback
                WHERE feedback_id IN (
                    SELECT feedback_id
                    FROM messages
                    WHERE conversation_id = ?
                )
            """, (conversation_id,))
            
            cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
            cursor.execute("DELETE FROM conversations WHERE conversation_id = ?", (conversation_id,))
            
            conn.commit()
            return f"Conversation with ID {conversation_id} deleted successfully."
        else:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        if conn:
            conn.close()

def get_all_conversations(user_id: int):
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT conversation_id, title, user_id, llm_id, created_at FROM conversations WHERE user_id = ?", (user_id,))
    data=cursor.fetchall()
    conn.close()
    conversations = [Conversation(conversation_id=row[0], 
                      title=row[1], 
                      user_id=row[2], 
                      llm_id=row[3], 
                      created_at=row[4]) for row in data]
    return conversations

async def send_query(conversation_id: int, query: Query, user_id: int):
    if not query.query_text.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        request_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM conversations WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")

        cursor.execute("SELECT task_description FROM tasks WHERE task_id = ?", (query.task_id,))
        task = cursor.fetchone()
        
        if not task:
            raise HTTPException(status_code=404, detail=f"Task with ID {query.task_id} not found.")
            
        response = str(await get_chatbot_response(query=query.query_text, task=task))
        response_created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        comment = str(await get_chatbot_comment(query=query.query_text, task=task))
        metrics = await calculate_metrics(query=query.query_text, task=task)
        metrics_json = json.dumps(metrics)
        
        sql_insert_feedback = """INSERT INTO feedback (comment, metrics) VALUES (?, ?)"""
        cursor.execute(sql_insert_feedback, (comment, metrics_json))
        feedback_id=cursor.lastrowid
        conn.commit()

        sql_insert_message = '''INSERT INTO messages (conversation_id, message_class, content, feedback_id, created_at)
                                VALUES (?, ?, ?, ?, ?)'''
        cursor.execute(sql_insert_message, (conversation_id, 'Request', query.query_text, feedback_id, request_created_at))
        query_id=cursor.lastrowid
        conn.commit() 
        cursor.execute(sql_insert_message, (conversation_id, 'Response', response, feedback_id, response_created_at))
        response_id=cursor.lastrowid
        conn.commit() 
        entire_response = EntireResponse(conversation_id=conversation_id,
                                      query_id=query_id,
                                      response_id=response_id,
                                      response_text=response,
                                      comment=comment,
                                      metrics=Metrics(metrics=metrics)
                                     )
        return entire_response
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def get_task_by_id(task_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM tasks WHERE task_id = ?", (task_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found.")
        return Task(task_id=row[0], 
                    task_name=row[1], 
                    category=row[2], 
                    description=row[3])
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def get_all_messages_by_conversation_id(conversation_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM conversations WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
        
        sql_select = ''' SELECT message_id, message_class, content, feedback_id
                         FROM messages
                         WHERE conversation_id = ?
                     '''
        cursor.execute(sql_select, (conversation_id,))
        rows = cursor.fetchall()
        
        messages: List[Message] = [
            Message(
                message_id=row[0],
                message_class=row[1],
                content=row[2],
                feedback_id=row[3]
            ) for row in rows]
        return messages
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def get_feedback_by_query_id(query_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM messages WHERE message_id = ?", (query_id,))
        message = cursor.fetchone()
        if not message:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")
            
        sql_join_query = """SELECT feedback.feedback_id, feedback.comment, feedback.metrics
                        FROM feedback
                        JOIN messages ON feedback.feedback_id = messages.feedback_id
                        WHERE messages.message_id = ?"""
        
        cursor.execute(sql_join_query, (query_id,))
        row = cursor.fetchone()
        feedback = Feedback(
            feedback_id=row[0],
            comment=row[1],
            metrics=Metrics(metrics=json.loads(row[2]))
        )
        return feedback
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def get_metrics_by_query_id(query_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM messages WHERE message_id = ?", (query_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")

        sql_select = """SELECT feedback.metrics
                        FROM feedback
                        JOIN messages ON feedback.feedback_id = messages.feedback_id
                        WHERE messages.message_id = ?"""
        
        cursor.execute(sql_select, (query_id,))
        metrics = cursor.fetchone()
        
        if not metrics:
            raise HTTPException(status_code=404, detail=f"Metrics with ID {query_id} not found.")
        return Metrics(**json.loads(metrics[0]))
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()