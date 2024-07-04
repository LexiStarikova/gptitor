from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from Core import models

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# TODO: check whether user has a real access to the conversation

# def get_current_user(token: str = Depends(oauth2_scheme)):
def get_current_user():
    # Here you would typically implement authentication logic
    # For example, verify the token and fetch the current user from database
    # Replace with your actual implementation based on your authentication method
    # user_id = verify_token(token)
    # if user_id is None:
    #     raise HTTPException(status_code=401, detail="Invalid credentials")
    return 1

def verify_token(token: str) -> int:
    # Example function to verify JWT token
    # Replace with your actual token verification logic
    # Example: decode token and extract user_id
    # For demonstration, assuming the token contains user_id
    # Replace this with your actual token validation method
    return 1  # Placeholder; replace with actual user ID extraction
