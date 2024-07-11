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
        if db.query(models.Category).count() == 0:
            # Load categories from JSON file
            with open("Data/categories.json") as f:
                categories = json.load(f)
                # Convert to Category instances
                category_models = [models.Category(**category) for category in categories]
                # Insert initial categories data
                db.add_all(category_models)
                db.commit()
        if db.query(models.Task).count() == 0:
            # Load tasks from JSON file
            with open("Data/tasks.json") as f:
                tasks = json.load(f)
                # Insert initial tasks data
                for task in tasks:
                # Find the category_id for the task's category
                    category = (db.query(models.Category)
                                .filter_by(category_name=task["task_category"])
                                .first())
                    if category:
                        task_model = models.Task(
                            task_category_id=category.category_id,
                            task_name=task["task_name"],
                            task_description=task["task_description"]
                        )
                        db.add(task_model)
            db.commit()
