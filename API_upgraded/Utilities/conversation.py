from Core.schemas import *

#TODO: implement generating title when the first query in a chat is sent
def generate_title(conversation: Conversation):
    return f"Title example for conversation: {conversation.conversation_id}"

#TODO: implement extracting keywords when the first query in a chat is sent
def extract_keywords(conversation: Conversation):
    return f"Keywords example for conversation: {conversation.conversation_id}"