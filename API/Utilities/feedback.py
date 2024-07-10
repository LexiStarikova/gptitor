import sqlite3
from Core.schemas import *
from fastapi import (
    HTTPException,
)

from Utilities.llm import LLM
llm = LLM()

async def get_chatbot_response(query: str, task: str) -> str:    
    res = await llm.get_response({"prompt": query, 'temperature': 0.1, 'max_tokens': 300})
    return res

async def get_chatbot_comment(query: str, task: str) -> str:
    prompt = f"""You are chatbot evaluating user queries to LLM written to solve a task.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Give a polite comment about this query:"""
    
    res = await llm.get_response({"prompt": prompt, 'temperature': 0.1, 'max_tokens': 300})
    return res

async def calculate_metrics(query: str, task: str) -> dict:
    metrics = {
        "criterion_1": await calculate_criterion_conciseness_and_focus(query, task),
        "criterion_2": await calculate_criterion_clarity_and_specificity(query, task),
        "criterion_3": await calculate_criterion_relevance_and_context(query, task),
        "criterion_4": await calculate_criterion_purpose_and_desired_output(query, task)
    }
    return metrics

async def calculate_criterion_conciseness_and_focus(query: str, task: str) -> float:
    prompt = f"""You are chatbot evaluating user queries to LLM written to solve a task.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of conciseness and focus, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": r"([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_clarity_and_specificity(query: str, task: str) -> float:    
    prompt = f"""You are chatbot evaluating user queries to LLM written to solve a task.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of clarity and specificity, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": r"([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_relevance_and_context(query: str, task: str) -> float:
    prompt = f"""You are chatbot evaluating user queries to LLM written to solve a task.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of relevance and context, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": r"([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_purpose_and_desired_output(query: str, task: str) -> float:
    prompt = f"""You are chatbot evaluating user queries to LLM written to solve a task.
    There is the task: {task}.
    There is the query that user formulated for this problem: {query}
    Rate this query in terms of purpose and desired output, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": r"([0-4](\.[0-9]))"})
    return float(res)