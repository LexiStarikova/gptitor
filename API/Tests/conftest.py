# TODO: remove unused imports (flake8)
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import create_database, drop_database
from fastapi.testclient import TestClient
# import Core
from Core.database import Base, get_db
from Core.main import app
from sqlalchemy.orm import Session
from Core import models
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                                            "check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False,
                                   autoflush=False, bind=engine)


@pytest.fixture(scope="session")
def db_engine():
    create_database(SQLALCHEMY_DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    yield engine
    drop_database(SQLALCHEMY_DATABASE_URL)


@pytest.fixture(scope="session")
def db_session(db_engine):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides[get_db] = get_db


@pytest.fixture(scope="function")
def feedback_data(db_session: Session):
    feedback = models.Feedback(comment="Test Comment",
                               metrics={
                                   "criterion_1": 4.0,
                                   "criterion_2": 3.5,
                                   "criterion_3": 2.0,
                                   "criterion_4": 1.0})
    db_session.add(feedback)
    db_session.commit()
    return feedback


@pytest.fixture(scope="function")
def conversation_data(db_session: Session, user_data):
    conversation = models.Conversation(title="Test Conversation",
                                       user_id=user_data.user_id,
                                       llm_id=1,
                                       created_at=datetime.now())
    db_session.add(conversation)
    db_session.commit()
    return conversation


@pytest.fixture(scope="function")
def message_data(db_session: Session, conversation_data, feedback_data):
    message = models.Message(conversation_id=conversation_data.conversation_id,
                             message_class='Request',
                             content='Test message',
                             task_id=1,
                             feedback_id=feedback_data.feedback_id,
                             created_at=datetime.now())
    db_session.add(message)
    db_session.commit()
    return message


@pytest.fixture(scope="function")
def task_data(db_session: Session):
    task = models.Task(task_name="Test Task",
                       task_category="General",
                       task_description="Testing task")
    db_session.add(task)
    db_session.commit()
    return task


@pytest.fixture(scope="function")
def llm_data():
    return {
        "llm_id": 1
    }


@pytest.fixture(scope="function")
def user_data(db_session: Session):
    user = models.User(token="token", name="username")
    db_session.add(user)
    db_session.commit()
    return user
