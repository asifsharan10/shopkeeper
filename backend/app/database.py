import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def get_store_by_api_key(api_key: str):
    result = supabase.table("stores")\
        .select("*")\
        .eq("api_key", api_key)\
        .eq("is_active", True)\
        .execute()
    if result.data and len(result.data) > 0:
        return result.data[0]
    return None

def save_message(store_id: str, session_id: str, role: str, content: str):
    conv = supabase.table("conversations")\
        .select("id")\
        .eq("store_id", store_id)\
        .eq("session_id", session_id)\
        .execute()

    if conv.data:
        conv_id = conv.data[0]["id"]
    else:
        new_conv = supabase.table("conversations")\
            .insert({"store_id": store_id, "session_id": session_id})\
            .execute()
        conv_id = new_conv.data[0]["id"]

    supabase.table("messages").insert({
        "conversation_id": conv_id,
        "store_id": store_id,
        "role": role,
        "content": content
    }).execute()