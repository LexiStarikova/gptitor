from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, date

class Query(BaseModel):
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)
    task_id: int = Field(default=1, 
                         examples=[0])
    llm_id: int = Field(default=0, 
                        examples=[0])

#TODO: implement renaming
class Name(BaseModel):
    new_name: str = Field(default="Untitled", 
                            examples=["Example name"], 
                            max_length=2048)

class LLM_ID(BaseModel):
    llm_id: int = Field(default=1, 
                        examples=[1])

class Metrics(BaseModel):
    metrics: Dict[str, Any] = Field(
        default={
            "criterion_1": 0.0,
            "criterion_2": 0.0,
            "criterion_3": 0.0,
            "criterion_4": 0.0
        },
        examples=[{
            "criterion_1": 5,
            "criterion_2": 4.5,
            "criterion_3": 3.2,
            "criterion_4": 0.0
        }]
    )

class PersonalStatistics(BaseModel):
    metrics: Dict[str, Any] = Field(
        default={
            "criterion_1": 0.0,
            "criterion_2": 0.0,
            "criterion_3": 0.0,
            "criterion_4": 0.0
        },
        examples=[{
            "criterion_1": 5,
            "criterion_2": 4.5,
            "criterion_3": 3.2,
            "criterion_4": 0.0
        }]
    )
    total_activity: Dict[str, Any] = Field(
        default={
            "total_queries": 0,
            "total_conversations": 0,
            "tasks_solved": 0
        },
        examples=[{
            "total_queries": 10,
            "total_conversations": 15,
            "tasks_solved": 3
        }]
    )
    daily_activity: List[Dict[str, Any]] = Field(
        default={
            "date": None,
            "number_of_queries": 0
        },
        examples = [{
            "date": "%Y-%m-%d",
            "number_of_queries": 34
        }]
    )

class EntireResponse(BaseModel):
    conversation_id: int = Field(default=0, 
                                 examples=[0])
    query_id: int = Field(default=0, 
                          examples=[0])
    response_id: int = Field(default=0, 
                             examples=[0])
    response_text: str = Field(default="", 
                               examples=["Example response"], 
                               max_length=2048)
    comment: str = Field(default="", 
                         examples=["Example comment"], 
                         max_length=2048)
    metrics: Dict[str, Any] = Field(default={"criterion_1": 0.0,
                                             "criterion_2": 0.0,
                                             "criterion_3": 0.0,
                                             "criterion_4": 0.0},
                                   examples=[{
                                            "criterion_1": 5,
                                            "criterion_2": 4.5,
                                            "criterion_3": 3.2,
                                            "criterion_4": 0.0
                                            }])   
class Feedback(BaseModel):
    feedback_id: int = Field(default=0, 
                             examples=[0])
    comment: str = Field(default="", 
                         examples=["Example comment"], 
                         max_length=2048)
    metrics: Metrics = Field(default={"criterion_1": 0.0,
                                      "criterion_2": 0.0,
                                      "criterion_3": 0.0,
                                      "criterion_4": 0.0})  

class Message(BaseModel):
    message_id: int = Field(default=0, 
                            examples=[0])
    message_class: str = Field(default='Request',
                               examples=['Request', 'Response'])
    content: str = Field(default="",
                         examples=["Example content"])
    feedback_id: int = Field(default=0, 
                 examples=[0])

class Conversation(BaseModel):
    conversation_id: int = Field(default=0, 
                                 examples=[0])
    user_id: int = Field(default=0, 
                         examples=[0])
    title: Optional[str] = Field(default="Untitled", 
                                 examples=["Example title"], 
                                 max_length=255)
    llm_id: int = Field(default=1, 
                        examples=[1])
    created_at: datetime = Field(default=None, 
                                 examples=["%Y-%m-%d %H:%M:%S"])
    # keywords: Optional[str] = Field(default=None, 
    #                                 examples=["Example keywords"], 
    #                                 max_length=255)
    # task_id: Optional[int] = Field(default=1, 
    #                                examples=[1])


class Criterion(BaseModel):
    score: float = Field(default=0.0,
                         examples=[0.0])

class Task(BaseModel):
    task_id: int = Field(default=0, 
                         examples=[0])
    task_name: str = Field(default="", 
                           examples=["Example name"], 
                           max_length=255)
    category: str = Field(default="", 
                           examples=["Example category"], 
                           max_length=255)
    description: str = Field(default="", 
                             examples=["Example description"], 
                             max_length=2048)