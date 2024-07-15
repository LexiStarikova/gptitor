from Core import crud
from fastapi import HTTPException
from Utilities.llm import llm_dict


async def get_chatbot_response(query: str,
                               llm_id: int = 1) -> str:
    if not llm_dict:
        raise HTTPException(
                status_code=404,
                detail=f"LLM with ID {llm_id} not found.")
    res = await llm_dict[llm_id].get_response({"prompt": query,
                                               'temperature': 0.1,
                                               'max_tokens': 300})
    return res


async def get_chatbot_comment(query: str,
                              task: str = "",
                              llm_id: int = 1) -> str:
    if not llm_dict:
        raise HTTPException(
                status_code=404,
                detail=f"LLM with ID {llm_id} not found.")
    if task:
        prompt = (
            f"You evaluate user queries for task-solving LLM.\n"
            f"There is a task: {task}.\n"
            f"There is a query that a user formulated for this problem: {query}\n"
            f"Give a polite comment about this query:"
        )
    else:
        prompt = (
            f"You evaluate user queries to LLM.\n"
            f"There is a query that a user formulated: {query}\n"
            f"Give a polite comment about this query:"
        )
        
    res = await llm_dict[llm_id].get_response({
        "prompt": prompt,
        "temperature": 0.1,
        "max_tokens": 300
    })
    return res

async def calculate_metrics(query: str,
                            task: str,
                            llm_id: int = 1) -> dict:
    if not llm_dict:
        raise HTTPException(
                status_code=404,
                detail=f"LLM with ID {llm_id} not found.")
    metrics = {
        "criterion_1": await get_criterion_feedback(query,
                                                    task,
                                                    "conciseness and focus",
                                                    llm_id),
        "criterion_2": await get_criterion_feedback(query,
                                                    task,
                                                    "clarity and specifity",
                                                    llm_id),
        "criterion_3": await get_criterion_feedback(query,
                                                    task,
                                                    "relevance and context",
                                                    llm_id),
        "criterion_4": await get_criterion_feedback(query,
                                                    task,
                                                    "purpose and desired output",
                                                    llm_id)
    }
    return metrics


async def get_criterion_feedback(
    query: str,
    task: str,
    string_criterion: str,
    llm_id: int = 1) -> float:
    prompt_task = f"There is the task: {task}.\n" if task else ""
    prompt = (
        f"You evaluate user queries for task-solving LLM.\n"
        f"{prompt_task}"
        f"There is a query that the user formulated: {query}.\n"
        f"Rate this query in terms of {string_criterion},\n"
        f"give a rating from 0 to 5. Put only one number:"
    )
    score = await llm_dict[llm_id].get_response({"prompt": prompt,
                                                 "regex": r"([0-4](\.[0-9]))"})
    prompt = (
        f"You evaluate user queries for task-solving LLM.\n"
        f"{prompt_task}"
        f"There is a query that the user formulated: {query}.\n"
        f"Suggest how to improve this query in terms of {string_criterion}.\n"
        f"Be concise, formulate your suggestions in two sentences."
    )
    comment = await llm_dict[llm_id].get_response({
        "prompt": prompt,
        "temperature": 0.1,
        "max_tokens": 300
    })
    return {"score": float(score),
            "comment":comment}