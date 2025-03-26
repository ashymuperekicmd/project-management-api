# Project Management API Documentation

## Base URL
`https://project-management-api.onrender.com/api`

## Projects

### Get all projects
`GET /projects`

**Response**
```json
[
  {
    "_id": "5f8d0a4b7f4e3a2a1c8b4567",
    "name": "Website Redesign",
    "description": "Redesign company website",
    "startDate": "2023-01-15T00:00:00.000Z",
    "endDate": "2023-03-15T00:00:00.000Z",
    "status": "in-progress",
    "budget": 5000,
    "client": "Acme Corp"
  }
]