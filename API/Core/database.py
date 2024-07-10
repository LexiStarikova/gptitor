from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from Core import models
import json

URL_DATABASE = 'sqlite:///./gptitor.db'

engine = create_engine(URL_DATABASE, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def insert_initial_data():
    with SessionLocal() as db:
        # Check if the table is empty
        if db.query(models.AIModel).count() == 0:
            # Insert initial data
            with open("Data/llms.json") as f:
                llms = json.load(f)
                # Convert to AIModel instances
                llm_models = [models.AIModel(**llm) for llm in llms]
                # Insert initial data
                db.add_all(llm_models)
                db.commit()
        if db.query(models.Task).count() == 0:
            # Load data from JSON file
            with open("Data/tasks.json") as f:
                tasks = json.load(f)
                # Convert to Task instances
                task_models = [models.Task(**task) for task in tasks]
                # Insert initial data
                db.add_all(task_models)
                db.commit()
