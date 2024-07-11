from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers import (
    conversations,
    feedback,
    messages,
    tasks,
    profile,
    llms,
    categories
)
from contextlib import asynccontextmanager
from Utilities.llm import init_llm_dict
from Core.database import (
    engine,
    SessionLocal,
    Base
)
from Utilities.init_db import insert_initial_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    Base.metadata.create_all(bind=engine)
    insert_initial_data()
    init_llm_dict()
    yield
    # Shutdown event
    SessionLocal().close()


app = FastAPI(lifespan=lifespan)


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
app.include_router(categories.router,
                   prefix="/categories",
                   tags=["task categories"])
app.include_router(tasks.router,
                   prefix="/tasks",
                   tags=["tasks"])
app.include_router(profile.router,
                   prefix="/profile",
                   tags=["profile"])
app.include_router(llms.router,
                   prefix="/llms",
                   tags=["LLMs"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Core.main:app", host="127.0.0.1", port=8000, reload=True)
