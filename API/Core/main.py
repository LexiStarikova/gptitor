from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers import (
    conversations,
    feedback,
    messages,
    tasks,
    profile,
    llms
)
from Utilities.feedback import init_llm_dict
from Core.database import (
    engine,
    SessionLocal,
    Base,
    insert_initial_data
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router,
                   prefix="/conversations",
                   tags=["conversations"])
app.include_router(feedback.router,
                   prefix="/feedback",
                   tags=["feedback"])
app.include_router(messages.router,
                   prefix="/conversations",
                   tags=["messages"])
app.include_router(tasks.router,
                   prefix="/tasks",
                   tags=["tasks"])
app.include_router(profile.router,
                   prefix="/profile",
                   tags=["profile"])
app.include_router(llms.router,
                   prefix="/llms",
                   tags=["LLMs"])


@app.on_event("startup")
def on_startup():
    # Create the database tables
    Base.metadata.create_all(bind=engine)
    # Insert initial data if tables are empty
    insert_initial_data()
    # Initialize the llm_dict
    init_llm_dict()


@app.on_event("shutdown")
def on_shutdown():
    # Close the database connection
    SessionLocal().close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Core.main:app", host="127.0.0.1", port=8000, reload=True)
