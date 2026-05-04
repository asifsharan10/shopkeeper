import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODELS = {
    "groq": "llama-3.1-8b-instant",
    "groq_large": "llama3-70b-8192",
    "gemini": "gemini-2.0-flash",
    "claude": "claude-sonnet-4-20250514",
    "openai": "gpt-4o",
}

def get_ai_response(
    user_message: str,
    store_context: str,
    chat_history: list = [],
    model: str = "groq"
):
    system_prompt = f"""You are a customer support assistant for a store.

YOUR ONLY SOURCE OF TRUTH IS THIS:
===STORE INFORMATION START===
{store_context}
===STORE INFORMATION END===

ABSOLUTE RULES:
1. You ONLY know what is written between STORE INFORMATION START and END
2. If the store information does not list specific products, say "I don't have our specific product details here, let me connect you with our team."
3. NEVER mention any brand name, product name, model, or price that is not written in the store information above
4. NEVER use your training knowledge about any products, brands, or companies
5. If asked about a specific product not in the store information, say "That's not something I have details on right now. Let me connect you with our team."
6. Do NOT recommend, suggest, or compare any product not explicitly listed above

You are NOT a general shopping assistant. You ONLY represent this specific store and ONLY know what the store told you above.
"""

    if model in ["groq", "groq_large"]:
        messages = [{"role": "system", "content": system_prompt}]

        for msg in chat_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=MODELS[model],
            messages=messages,
            max_tokens=300,
            temperature=0.1,
        )

        return response.choices[0].message.content

    else:
        raise ValueError(f"Model '{model}' not yet configured.")