import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "API Key not found!")

genai.configure(api_key=api_key)

# List available models
print("\n--- Available Models ---")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)

# Test with correct model
model = genai.GenerativeModel("gemini-3.5-flash")

response = model.generate_content("Hello")

print("\n--- Gemini Response ---")
print(response.text)
