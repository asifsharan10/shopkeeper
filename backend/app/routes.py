from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.ai import get_ai_response
from app.database import get_store_by_api_key, save_message
from typing import Optional
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_history: list = []
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    x_api_key: Optional[str] = Header(None)
):
    # Validate API key
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")

    store = get_store_by_api_key(x_api_key)
    if not store:
        raise HTTPException(status_code=401, detail="Invalid API key")

    # Generate session ID if not provided
    session_id = request.session_id or str(uuid.uuid4())

    # Save user message
    save_message(store["id"], session_id, "user", request.message)

    # Get AI response
    try:
        reply = get_ai_response(
            user_message=request.message,
            store_context=store["store_context"],
            chat_history=request.chat_history,
            model=store["ai_model"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Save assistant reply
    save_message(store["id"], session_id, "assistant", reply)

    return ChatResponse(reply=reply, session_id=session_id)

@router.get("/store-config")
async def get_store_config(x_api_key: Optional[str] = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")

    store = get_store_by_api_key(x_api_key)
    if not store:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return {
        "name": store["name"],
        "welcome_message": store["welcome_message"],
        "widget_color": store["widget_color"],
    }

@router.get("/health")
def health():
    return {"status": "ok", "product": "Shopkeeper"}