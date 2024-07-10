from Core.schemas import Conversation


# TODO: implement generating title when the first query in a chat is sent
def generate_title(conversation: Conversation) -> str:
    """Generate a title for the conversation."""
    return f"Title example for conversation: {conversation.conversation_id}"


# TODO: implement extracting keywords when the first query in a chat is sent
def extract_keywords(conversation: Conversation) -> str:
    """Extract keywords from the conversation."""
    return f"Keywords example for conversation: {conversation.conversation_id}"
