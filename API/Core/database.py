from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

URL_DATABASE = 'sqlite:///./gptitor.db'

# creating the engine to handle the sessions
engine = create_engine(URL_DATABASE, connect_args={"check_same_thread":False})

# creating sessionMaker to handle transactions
SessionLocal = sessionmaker(autocomit = False, autoflush=False, bind=engine)

# base class for ORM for mapping tables and classes
Base = declarative_base() 