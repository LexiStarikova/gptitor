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
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the prompt that the user formulated to solve this problem: {query}
    Give a polite comment about this:"""
    
    res = await llm.get_response({"prompt": prompt, 'temperature': 0.1, 'max_tokens': 300})
    return res

async def calculate_metrics(query: str, task: str) -> dict:
    metrics = {
        "criterion_1": await calculate_criterion_style(query, task),
        "criterion_2": await calculate_criterion_accuracy(query, task),
        "criterion_3": await calculate_criterion_number_of_vowels(query, task),
        "criterion_4": await calculate_criterion_weather(query, task)
    }
    return metrics

async def calculate_criterion_style(query: str, task: str) -> float:
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of writing style, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_accuracy(query: str, task: str) -> float:    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of accuracy of the answer, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_number_of_vowels(query: str, task: str) -> float:
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of number_of_vowels, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_weather(query: str, task: str) -> float:
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of weather on the street, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)