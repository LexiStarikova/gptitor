from Core.database import SessionLocal
from Core import crud

llm_dict = {}


def init_llm_dict():
    global llm_dict
    with SessionLocal() as db:
        llm_dict = crud.get_llm_dict(db)


async def get_chatbot_response(query: str,
                               task: str,
                               llm_id: int = 1) -> str:
    res = await llm_dict[llm_id].get_response({"prompt": query,
                                               'temperature': 0.1,
                                               'max_tokens': 300})
    return res


async def get_chatbot_comment(query: str,
                              task: str,
                              llm_id: int = 1) -> str:
    prompt = f"""You evaluate user queries for task-solving LLM.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Give a polite comment about this query:"""
    res = await llm_dict[llm_id].get_response({"prompt": prompt,
                                               'temperature': 0.1,
                                               'max_tokens': 300})
    return res


async def calculate_metrics(query: str,
                            task: str,
                            llm_id: int = 1) -> dict:
    metrics = {
        "criterion_1": await get_concise_focus(query, task, llm_id),
        "criterion_2": await get_clarity_spec(query, task, llm_id),
        "criterion_3": await get_relevance_ctx(query, task, llm_id),
        "criterion_4": await get_purpose_out(query, task, llm_id)
    }
    return metrics


# calculate_criterion_conciseness_and_focus
async def get_concise_focus(query: str,
                            task: str,
                            llm_id: int = 1) -> float:
    prompt = f"""You evaluate user queries for task-solving LLM.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of conciseness and focus,
    give a rating from 0 to 5. Put only one number:"""
    res = await llm_dict[llm_id].get_response({"prompt": prompt,
                                               "regex": r"([0-4](\.[0-9]))"})
    return float(res)


# calculate_criterion_clarity_and_specificity
async def get_clarity_spec(query: str,
                           task: str,
                           llm_id: int = 1) -> float:
    prompt = f"""You evaluate user queries for task-solving LLM.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of clarity and specificity,
    give a rating from 0 to 5. Put only one number:"""
    res = await llm_dict[llm_id].get_response({"prompt": prompt,
                                               "regex": r"([0-4](\.[0-9]))"})
    return float(res)


# calculate_criterion_relevance_and_context
async def get_relevance_ctx(query: str,
                            task: str,
                            llm_id: int = 1) -> float:
    prompt = f"""You evaluate user queries for task-solving LLM.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of relevance and context,
    give a rating from 0 to 5. Put only one number:"""
    res = await llm_dict[llm_id].get_response({"prompt": prompt,
                                               "regex": r"([0-4](\.[0-9]))"})
    return float(res)


# calculate_criterion_purpose_and_desired_output
async def get_purpose_out(query: str,
                          task: str,
                          llm_id: int = 1) -> float:
    prompt = f"""You evaluate user queries for task-solving LLM.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of purpose and desired output,
    give a rating from 0 to 5. Put only one number:"""
    res = await llm_dict[llm_id].get_response({"prompt": prompt,
                                               "regex": r"([0-4](\.[0-9]))"})
    return float(res)
