from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Table
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy_json import NestedMutableJson

engine = create_engine('sqlite:///gptitor.db', echo=True)

Base = declarative_base()

# Define association table for Conversations <-> Messages (many-to-many relationship)
conversation_message_association = Table(
    'conversation_message_association',
    Base.metadata,
    Column('conversation_id', Integer, ForeignKey('conversations.conversation_id')),
    Column('message_id', Integer, ForeignKey('messages.message_id'))
)

# Define User model
class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String)
    name = Column(String)

# Define Conversation model
class Conversation(Base):
    __tablename__ = 'conversations'
    conversation_id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    messages = relationship('Message', secondary=conversation_message_association, backref='conversations')
    llm_id = Column(Integer, ForeignKey('aimodels.llm_id'))
    created_at = Column(DateTime)

# Define AIModels model
class AIModel(Base):
    __tablename__ = 'aimodels'
    llm_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    api = Column(String)

# Define Message model
class Message(Base):
    __tablename__ = 'messages'
    message_id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(Integer)
    conversation_id = Column(Integer, ForeignKey('conversations.conversation_id'))
    message_class = Column(String)
    content = Column(String)
    feedback_id = Column(Integer)
    created_at = Column(DateTime)

# Define Feedback model (document-oriented table)
class Feedback(Base):
    __tablename__ = 'feedback'
    feedback_id = Column(Integer, primary_key=True, autoincrement=True)
    comment = Column(String)
    metrics = Column(NestedMutableJson)
    
class Task(Base):
    __tablename__ = 'tasks'
    task_id = Column(Integer, primary_key=True, autoincrement=True)
    task_category = Column(String)
    task_name = Column(String)
    task_description = Column(String)

# Create all tables in the database
Base.metadata.create_all(engine)