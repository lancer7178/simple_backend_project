# Simple Node.js Backend Project

A beginner-friendly Node.js backend project to learn REST API development and all HTTP methods (GET, POST, PUT, PATCH, DELETE).

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### GET Requests (Retrieve Data)

#### Get All Items

```bash
curl http://localhost:3000/api/items
```

**Response:**

```json
{
  "success": true,
  "message": "Retrieved all items",
  "data": [
    {
      "id": 1,
      "title": "Learn Node.js",
      "description": "Understand backend development",
      "completed": false
    }
  ],
  "count": 3
}
```

#### Get Single Item by ID

```bash
curl http://localhost:3000/api/items/1
```

**Response:**

```json
{
  "success": true,
  "message": "Item retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Understand backend development",
    "completed": false
  }
}
```

---

### POST Request (Create New Data)

Create a new item:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn MongoDB",
    "description": "Database for Node.js"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "title": "Learn MongoDB",
    "description": "Database for Node.js",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### PUT Request (Complete Update)

Replace an entire item:

```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Node.js",
    "description": "Learn advanced concepts",
    "completed": true
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "title": "Advanced Node.js",
    "description": "Learn advanced concepts",
    "completed": true,
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### PATCH Request (Partial Update)

Update only specific fields of an item:

```bash
curl -X PATCH http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Item partially updated successfully",
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Understand backend development",
    "completed": true,
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

---

### DELETE Request (Remove Data)

Delete an item:

```bash
curl -X DELETE http://localhost:3000/api/items/1
```

**Response:**

```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Understand backend development",
    "completed": false
  }
}
```

---

## 🔍 Understanding HTTP Methods

| Method     | Purpose                 | Use Case                         |
| ---------- | ----------------------- | -------------------------------- |
| **GET**    | Retrieve data           | Fetch items, search, filter data |
| **POST**   | Create new data         | Submit forms, create new records |
| **PUT**    | Replace entire resource | Update complete object           |
| **PATCH**  | Partial update          | Update specific fields only      |
| **DELETE** | Remove data             | Delete records                   |

### Key Differences: PUT vs PATCH

- **PUT**: Replaces the entire resource. All fields must be provided.
- **PATCH**: Updates only the fields you provide, leaving others unchanged.

Example:

```
Original: { id: 1, title: "Learn Node.js", description: "Backend dev", completed: false }

PUT  { title: "New Title", description: "New Desc" }
→ completed field becomes undefined/null

PATCH { title: "New Title" }
→ description and completed remain unchanged
```

---

## 📁 Project Structure

```
simple-backend/
├── server.js           # Main server file with all routes
├── package.json        # Project configuration & dependencies
└── README.md          # This file
```

---

## 🧠 Learning Path

1. **Understand Middleware**: The `app.use()` calls set up middleware for parsing JSON and enabling CORS
2. **Learn Routes**: Study each HTTP method implementation
3. **Explore Status Codes**: Notice how different responses use different HTTP status codes
4. **Add Features**: Try adding features like:
   - Database integration (MongoDB, SQLite)
   - Authentication
   - Data validation
   - Error handling

---

## 📝 HTTP Status Codes Used

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid data              |
| 404  | Not Found - Resource doesn't exist      |
| 500  | Server Error                            |

---

## 🛠️ Useful Tools for Testing

### Using curl (Command Line)

Already shown in examples above.

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint
3. Test different HTTP methods

### Using VS Code REST Client Extension

1. Install "REST Client" extension
2. Create a `.rest` file and write requests (see below)

---

## 🎯 Next Steps

- Learn about databases (MongoDB, PostgreSQL)
- Add authentication (JWT tokens)
- Implement proper error handling
- Add input validation
- Learn about middleware
- Explore async/await

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

---

Happy Learning! 🚀
