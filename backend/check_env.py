from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    print(f"Success: GEMINI_API_KEY is loaded. (Value starts with: {api_key[:5]}...)")
else:
    print("Error: GEMINI_API_KEY is missing or not loading.")