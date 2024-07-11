from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy_json import NestedMutableJson
from sqlalchemy.sql import func
from Core.database import Base, engine


class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String)
    name = Column(String)


class Conversation(Base):
    __tablename__ = 'conversations'
    conversation_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    llm_id = Column(Integer, ForeignKey("aimodels.llm_id"))
    created_at = Column(DateTime, server_default=func.now())

    messages = relationship("Message", back_populates="conversation")


class AIModel(Base):
    __tablename__ = 'aimodels'
    llm_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    url = Column(String)


class Message(Base):
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer, ForeignKey('tasks.task_id'))
    conversation_id = Column(Integer,
                             ForeignKey('conversations.conversation_id'))
    message_class = Column(String)
    content = Column(String)
    feedback_id = Column(Integer, ForeignKey("feedback.feedback_id"))
    created_at = Column(DateTime, server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")
    feedback = relationship("Feedback", back_populates="messages")


class Feedback(Base):
    __tablename__ = 'feedback'
    feedback_id = Column(Integer, primary_key=True, autoincrement=True)
    comment = Column(String)
    metrics = Column(NestedMutableJson)

    messages = relationship("Message", back_populates="feedback")


class Category(Base):
    __tablename__ = 'categories'
    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String, nullable=False)
    category_description = Column(String)

    tasks = relationship('Task', back_populates='category')

class Task(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, primary_key=True, autoincrement=True)
    task_category_id = Column(Integer, ForeignKey('categories.category_id'))
    task_name = Column(String, nullable=False)
    task_description = Column(String)

    category = relationship('Category', back_populates='tasks')


Base.metadata.create_all(engine)
