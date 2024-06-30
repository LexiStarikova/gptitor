from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers import conversations, feedback, messages, tasks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(messages.router, prefix="/conversations", tags=["messages"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("Core.main:app", host="127.0.0.1", port=8000, reload=True)
