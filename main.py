import os
import json
import google.generative

ai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi.middleware.cors import CORSMiddleware

# --- Environment and API Configuration ---

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

    GEMINI_API_KEY: str

# Load settings
settings = Settings()

# Configure the generative AI model
genai.configure(api_key=settings.GEMINI_API_KEY)

# This is the prompt you designed. It instructs the model to act as a JSON-only
# to-do list chatbot.
SYSTEM_PROMPT = """
You are a specialized language model that functions as a to-do list chatbot. Your sole purpose is to interpret user messages and convert them into a structured JSON format. You must not engage in conversation or provide any output other than the specified JSON object.

The JSON output must conform to the following schema:
{
  "action": "add | update | delete | list | complete",
  "task": "<description of the task>",
  "due_date": "<due date in YYYY-MM-DD format, if provided>",
  "task_id": "<the ID of the task, if provided>"
}

- The `action` field must be one of the following strings: "add", "update", "delete", "list", "complete".
- The `task` field should contain the specific to-do item.
- The `due_date` should be extracted and formatted as YYYY-MM-DD. If no due date is mentioned, this field should be an empty string.
- The `task_id` is only required for "update", "delete", and "complete" actions. For "add" and "list" actions, it should be an empty string.

Your response must ONLY be the JSON object and nothing else.
"""

# Initialize the Gemini model with the system prompt
model = genai.GenerativeModel(
    model_name="models/gemini-1.5-flash-latest",
    system_instruction=SYSTEM_PROMPT,
)


# --- Pydantic Schemas for Data Validation ---

# Schema for the incoming user message
class ChatRequest(BaseModel):
    message: str

# Schema for the expected JSON structure from Gemini
# This helps validate the response from the AI.
class GeminiResponse(BaseModel):
    action: str
    task: str | None = None
    due_date: str | None = None
    task_id: str | None = None


# --- FastAPI Application ---

app = FastAPI(
    title="To-Do App with Gemini Chatbot",
    description="A simple to-do list API with a Gemini-powered chatbot for natural language task management.",
)

# Add CORS middleware to allow cross-origin requests from the frontend
origins = [
    "http://localhost:3000",  # Allow your Next.js frontend
    # You might want to add other origins for production environments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Placeholder To-Do Service Functions ---
# In a real application, these functions would interact with your database.
# They are mocked here to demonstrate the flow.

async def service_add_task(task: str, due_date: str | None):
    # In a real app, you would add the task to your database here.
    response = f"✅ Task '{task}' was added."
    if due_date:
        response += f" It is due on {due_date}."
    return response

async def service_list_tasks():
    # In a real app, you would fetch tasks from your database here.
    return "📝 Here are your tasks:\n1. Buy milk\n2. Finish report\n3. Call mom"

async def service_update_task(task_id: str, new_task_description: str, new_due_date: str | None):
    # In a real app, you would find and update the task in your database.
    response = f"🔄 Task {task_id} was updated to '{new_task_description}'."
    if new_due_date:
        response += f" New due date is {new_due_date}."
    return response

async def service_complete_task(task_id: str):
    # In a real app, you would mark the task as complete in your database.
    return f"🎉 Task {task_id} has been marked as complete!"

async def service_delete_task(task_id: str):
    # In a real app, you would delete the task from your database.
    return f"🗑️ Task {task_id} has been deleted."


# --- Chatbot Endpoint ---

@app.post("/chat")
async def chat_handler(req: ChatRequest):
    """
    Handles a user's chat message by sending it to Gemini, parsing the
    structured JSON response, and executing the corresponding to-do action.
    """
    try:
        # 1. Send user message to Gemini
        response = model.generate_content(req.message)
        gemini_response_text = response.text

        # 2. Parse Gemini's JSON response
        try:
            # Clean up the response in case it includes markdown formatting
            cleaned_json_str = gemini_response_text.strip().replace("```json", "").replace("```", "").strip()
            gemini_data = json.loads(cleaned_json_str)
            # Validate the data against our Pydantic model
            parsed_response = GeminiResponse(**gemini_data)
        except (json.JSONDecodeError, TypeError) as e:
            # Handle cases where Gemini's output is not valid JSON
            raise HTTPException(
                status_code=500,
                detail=f"AI response was not valid JSON. Raw response: {gemini_response_text}"
            )

        # 3. Call the correct To-Do service function based on the parsed action
        action = parsed_response.action
        chatbot_response = ""

        if action == "add":
            if not parsed_response.task:
                raise HTTPException(status_code=400, detail="Task description is required for 'add' action.")
            chatbot_response = await service_add_task(parsed_response.task, parsed_response.due_date)

        elif action == "list":
            chatbot_response = await service_list_tasks()

        elif action == "update":
            if not parsed_response.task_id or not parsed_response.task:
                raise HTTPException(status_code=400, detail="Task ID and description are required for 'update' action.")
            chatbot_response = await service_update_task(parsed_response.task_id, parsed_response.task, parsed_response.due_date)

        elif action == "complete":
            if not parsed_response.task_id:
                raise HTTPException(status_code=400, detail="Task ID is required for 'complete' action.")
            chatbot_response = await service_complete_task(parsed_response.task_id)

        elif action == "delete":
            if not parsed_response.task_id:
                raise HTTPException(status_code=400, detail="Task ID is required for 'delete' action.")
            chatbot_response = await service_delete_task(parsed_response.task_id)

        else:
            # Handle cases where the action is not one of the expected values
            raise HTTPException(
                status_code=400,
                detail=f"Unknown action '{action}' received from the chatbot."
            )

        # 4. Return the final chatbot response to the user
        return {"response": chatbot_response}

    except Exception as e:
        # Generic error handler for other potential issues
        raise HTTPException(status_code=500, detail=str(e))

# --- In-memory storage for tasks (in a real app, you'd use a database) ---
tasks_db = []
next_task_id = 1

# --- To-Do List CRUD Endpoints ---

@app.get("/todos/")
async def get_todos():
    """Get all to-do items."""
    return tasks_db

@app.post("/todos/")
async def create_todo(task: dict):
    """Create a new to-do item."""
    global next_task_id
    new_task = {
        "id": next_task_id,
        "task": task.get("task"),
        "due_date": task.get("due_date", ""),
        "status": task.get("status", "Pending")
    }
    tasks_db.append(new_task)
    next_task_id += 1
    return new_task

@app.put("/todos/{task_id}")
async def update_todo(task_id: int, task: dict):
    """Update an existing to-do item."""
    for i, t in enumerate(tasks_db):
        if t["id"] == task_id:
            tasks_db[i] = {
                "id": task_id,
                "task": task.get("task", t["task"]),
                "due_date": task.get("due_date", t["due_date"]),
                "status": task.get("status", t["status"])
            }
            return tasks_db[i]

    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/todos/{task_id}")
async def delete_todo(task_id: int):
    """Delete a to-do item."""
    global tasks_db
    initial_length = len(tasks_db)
    tasks_db = [t for t in tasks_db if t["id"] != task_id]

    if len(tasks_db) == initial_length:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}

# --- Health Check Endpoint ---

@app.get("/", tags=["Health Check"])
async def read_root():
    """A simple endpoint to confirm the server is running."""
    return {"status": "ok"}

