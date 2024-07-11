import aiohttp
from Core.database import SessionLocal
from fastapi import HTTPException
from Core.models import AIModel
from sqlalchemy.orm import Session

class LLM:
    def __init__(self, name: str,
                 url: str = "http://10.100.30.240:1222/generate"):
        self.url = url

    async def get_response(self, json_data):
        async with aiohttp.ClientSession() as session:
            async with session.post(self.url, json=json_data) as response:
                if response.status != 200:
                    raise Exception(f"Error: {response.status}")
                return await response.json()

llm_dict = {}


def get_llm_dict(db: Session):
    llm_dict = {}
    data = db.query(AIModel).all()
    if not data:
        raise HTTPException(
            status_code=404,
            detail="LLMs data not found."
        )
    for model in data:
        llm_instance = LLM(name=model.name,
                           url=model.url)
        llm_dict[model.llm_id] = llm_instance
    return llm_dict


def init_llm_dict():
    global llm_dict
    with SessionLocal() as db:
        llm_dict.update(get_llm_dict(db))
