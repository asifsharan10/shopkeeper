from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.ai import get_ai_response
from app.database import get_store_by_api_key, save_message
from typing import Optional
from datetime import datetime, timedelta
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
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")

    store = get_store_by_api_key(x_api_key)
    if not store:
        raise HTTPException(status_code=401, detail="Invalid API key")

    session_id = request.session_id or str(uuid.uuid4())
    save_message(store["id"], session_id, "user", request.message)

    try:
        reply = get_ai_response(
            user_message=request.message,
            store_context=store["store_context"],
            chat_history=request.chat_history,
            model=store["ai_model"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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

@router.get("/analytics")
async def get_analytics(x_api_key: Optional[str] = Header(None)):
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")

    store = get_store_by_api_key(x_api_key)
    if not store:
        raise HTTPException(status_code=401, detail="Invalid API key")

    from app.database import supabase

    store_id = store["id"]

    total_msgs = supabase.table("messages")\
        .select("id", count="exact")\
        .eq("store_id", store_id)\
        .execute()

    total_convs = supabase.table("conversations")\
        .select("id", count="exact")\
        .eq("store_id", store_id)\
        .execute()

    seven_days_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
    recent_msgs = supabase.table("messages")\
        .select("created_at, role")\
        .eq("store_id", store_id)\
        .gte("created_at", seven_days_ago)\
        .execute()

    thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
    monthly_msgs = supabase.table("messages")\
        .select("id", count="exact")\
        .eq("store_id", store_id)\
        .gte("created_at", thirty_days_ago)\
        .execute()

    daily_counts = {}
    for i in range(7):
        day = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        daily_counts[day] = 0

    for msg in (recent_msgs.data or []):
        if msg["role"] == "user":
            day = msg["created_at"][:10]
            if day in daily_counts:
                daily_counts[day] += 1

    daily_data = [
        {"date": k, "messages": v}
        for k, v in sorted(daily_counts.items())
    ]

    return {
        "total_messages": total_msgs.count or 0,
        "total_conversations": total_convs.count or 0,
        "messages_this_month": monthly_msgs.count or 0,
        "messages_last_7_days": daily_data,
    }

@router.get("/health")
def health():
    return {"status": "ok", "product": "Shopkeeper"}