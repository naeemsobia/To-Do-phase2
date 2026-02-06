import os
import google.generativeai as genai
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    GEMINI_API_KEY: str

settings = Settings()
genai.configure(api_key=settings.GEMINI_API_KEY)

# Test with a simple model
try:
    model = genai.GenerativeModel(model_name="gemini-pro")
    response = model.generate_content("Say hello")
    print("Model works:", response.text[:50])
except Exception as e:
    print(f"Error with gemini-pro: {e}")

# Also try gemini-1.5-pro
try:
    model = genai.GenerativeModel(model_name="gemini-1.5-pro")
    response = model.generate_content("Say hello")
    print("gemini-1.5-pro works:", response.text[:50])
except Exception as e:
    print(f"Error with gemini-1.5-pro: {e}")

# Also try gemini-1.5-flash
try:
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    response = model.generate_content("Say hello")
    print("gemini-1.5-flash works:", response.text[:50])
except Exception as e:
    print(f"Error with gemini-1.5-flash: {e}")