from fastapi import FastAPI, HTTPException, Response, status as http_status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class Todo(BaseModel):
    id: Optional[int] = None
    task: str
    due_date: str
    status: str

# In-memory database
todos: List[Todo] = []
next_id = 1

@app.get("/todos/", response_model=List[Todo])
def get_todos():
    return todos

@app.post("/todos/", response_model=Todo)
def create_todo(todo: Todo):
    global next_id
    todo.id = next_id
    next_id += 1
    todos.append(todo)
    return todo

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated_todo: Todo):
    for i, todo in enumerate(todos):
        if todo.id == todo_id:
            todos[i] = updated_todo
            updated_todo.id = todo_id
            return updated_todo
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    global todos
    initial_len = len(todos)
    todos = [todo for todo in todos if todo.id != todo_id]
    if len(todos) < initial_len:
        return Response(status_code=http_status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail="Todo not found")

@app.get("/")
def read_root():
    return {"Hello": "World"}