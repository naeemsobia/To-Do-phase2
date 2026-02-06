import os
import google.generativeai as genai
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')
    GEMINI_API_KEY: str

settings = Settings()
genai.configure(api_key=settings.GEMINI_API_KEY)

# List available models
try:
    models = genai.list_models()
    print("Available models:")
    for model in models:
        print(f"- {model.name}")
        print(f"  Supported operations: {model.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")