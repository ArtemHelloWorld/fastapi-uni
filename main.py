# Главный файл приложения
from fastapi import FastAPI, HTTPException, Query
from typing import List, Dict, Any
from datetime import datetime

app = FastAPI(
    title="ToDo лист API",
    description="API для управления задачами с использованием матрицы Эйзенхауэра",
    version="1.0.0",
    contact={"name": "Артём"}
)

# Временное хранилище (позже будет заменено на PostgreSQL)
tasks_db: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Сдать проект по FastAPI",
        "description": "Завершить разработку API и написать документацию",
        "is_important": True,
        "is_urgent": True,
        "quadrant": "Q1",
        "completed": False,
        "created_at": datetime.now()
    },
    {
        "id": 2,
        "title": "Изучить SQLAlchemy",
        "description": "Прочитать документацию и попробовать примеры",
        "is_important": True,
        "is_urgent": False,
        "quadrant": "Q2",
        "completed": False,
        "created_at": datetime.now()
    },
    {
        "id": 3,
        "title": "Сходить на лекцию",
        "description": None,
        "is_important": False,
        "is_urgent": True,
        "quadrant": "Q3",
        "completed": False,
        "created_at": datetime.now()
    },
    {
        "id": 4,
        "title": "Посмотреть сериал",
        "description": "Новый сезон любимого сериала",
        "is_important": False,
        "is_urgent": False,
        "quadrant": "Q4",
        "completed": True,
        "created_at": datetime.now()
    },
]

@app.get("/")
async def root():
    return {
        "message": "Привет, студент!",
        "api_title": app.title,
        "api_description": app.description,
        "api_version": app.version,
        "api_author": app.contact.get("name")
    }

@app.get("/tasks")
async def get_all_tasks() -> dict:
    return {
        "count": len(tasks_db),
        "tasks": tasks_db
    }

@app.get("/tasks/quadrant/{quadrant}")
async def get_tasks_by_quadrant(quadrant: str) -> dict:
    if quadrant not in ["Q1", "Q2", "Q3", "Q4"]:
        raise HTTPException(
            status_code=400,
            detail="Неверный квадрант. Используйте: Q1, Q2, Q3, Q4"
        )
    filtered_tasks = [
        task
        for task in tasks_db
        if task["quadrant"] == quadrant
    ]
    return {
        "quadrant": quadrant,
        "count": len(filtered_tasks),
        "tasks": filtered_tasks
    }

@app.get("/tasks/stats")
async def get_tasks_stats() -> dict:
    by_quadrant = {q: 0 for q in ["Q1", "Q2", "Q3", "Q4"]}
    by_status = {"completed": 0, "pending": 0}
    for task in tasks_db:
        if task["quadrant"] in by_quadrant:
            by_quadrant[task["quadrant"]] += 1
        if task["completed"]:
            by_status["completed"] += 1
        else:
            by_status["pending"] += 1
    return {
        "total_tasks": len(tasks_db),
        "by_quadrant": by_quadrant,
        "by_status": by_status
    }

@app.get("/tasks/search")
async def search_tasks(q: str = Query(..., min_length=2)) -> dict:
    filtered = [
        task for task in tasks_db
        if q.lower() in task["title"].lower() or
           (task["description"] and q.lower() in task["description"].lower())
    ]
    if not filtered:
        raise HTTPException(status_code=404, detail="Нет задач по данному запросу")
    return {"query": q, "count": len(filtered), "tasks": filtered}

@app.get("/tasks/status/{status}")
async def get_tasks_by_status(status: str) -> dict:
    if status not in ["completed", "pending"]:
        raise HTTPException(status_code=404, detail="Статус должен быть 'completed' или 'pending'")
    status_bool = True if status == "completed" else False
    filtered_tasks = [task for task in tasks_db if task["completed"] == status_bool]
    return {
        "status": status,
        "count": len(filtered_tasks),
        "tasks": filtered_tasks
    }


@app.get("/tasks/{task_id}")
async def get_task_by_id(task_id: int) -> dict:
    for task in tasks_db:
        if task['id'] == task_id:
            return task
    raise HTTPException(status_code=404, detail=f"Задача с ID={task_id} не найдена")
