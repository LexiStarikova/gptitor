import re
from Core import crud
from fastapi import HTTPException
from Utilities.llm import llm_dict


async def generate_title(query: str,
                         llm_id: int = 1) -> str:
    if not llm_dict:
        raise HTTPException(
                status_code=404,
                detail=f"LLM with ID {llm_id} not found.")
    prompt = f"""There is a query: {query}.
                 Generate a title for this query.
                 Put only brief and meaningful title."""
    res = await llm_dict[llm_id].get_response({"prompt": prompt})
    pattern = r"[a-zA-Z0-9 ]"
    filtered_res = ''.join(re.findall(pattern, res))
    return filtered_res


# TODO: implement extracting keywords when the first query in a chat is sent
# def extract_keywords(conversation: Conversation) -> str:
#     """Extract keywords from the conversation."""
#     return f"Keywords example for conversation: {conversation.conversation_id}"
