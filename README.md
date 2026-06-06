# Task Manager

A full-stack task management application built using React, FastAPI, SQLAlchemy, Pydantic, and MySQL.

## Features

* Create tasks
* View tasks
* Update task details and status
* Delete tasks
* Categorize tasks using tags
* Search tasks
* Sort tasks by due date

## Tech Stack

### Frontend

* React
* JavaScript
* CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* MySQL

## Project Structure

```text
lamda-project/
│
├── main.py
├── database.py
├── model.py
├── tasks.py
├── requirements.txt
├── README.md
│
├── task-frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── .env
```

## Setup
### Environment Variables

Create a `.env` file in the project root directory and add:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/task_db
```

### Backend

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/task_db
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

API available at:

```text
http://localhost:8000
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

### Frontend

Navigate to the frontend directory:

```bash
cd task-frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend available at:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| GET    | `/task`      | Retrieve all tasks |
| POST   | `/task`      | Create a task      |
| PUT    | `/task/{id}` | Update a task      |
| DELETE | `/task/{id}` | Delete a task      |

## Concepts Used

* REST API Design
* CRUD Operations
* SQLAlchemy ORM
* Pydantic Data Validation
* Dependency Injection
* React Hooks (`useState`, `useEffect`)
* CORS Configuration
* Client-Server Architecture
* Persistent Data Storage with MySQL
