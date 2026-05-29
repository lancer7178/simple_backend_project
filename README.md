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

## 📚 Advanced Learning Materials

This project now includes comprehensive advanced resources to help you grow as a backend developer:

### 📖 Available Guides

1. **[ADVANCED_TOPICS.md](ADVANCED_TOPICS.md)** 📚
   - 12 advanced backend concepts explained in detail
   - Error handling & validation
   - Custom middleware creation
   - Authentication & authorization (JWT, roles)
   - Async/await patterns
   - Request logging & debugging
   - Rate limiting
   - Caching strategies
   - API versioning
   - Testing your API
   - Performance optimization
   - Security best practices
   - Database integration (MongoDB, PostgreSQL)

2. **[ADVANCED_IMPLEMENTATION.md](ADVANCED_IMPLEMENTATION.md)** 💻
   - Complete working examples with code
   - Full server with error handling
   - Custom middleware suite
   - Authentication system implementation
   - Advanced filtering & pagination
   - Logging system
   - Rate limiting implementation
   - Copy-paste ready code

3. **[CHEAT_SHEET.md](CHEAT_SHEET.md)** ⚡
   - Quick reference guide
   - Common patterns & snippets
   - HTTP status codes reference
   - Utility functions (10+)
   - Best practices
   - Pro tips

4. **[LEARNING_GUIDE.md](LEARNING_GUIDE.md)** 🎓
   - Fundamental concepts
   - HTTP methods (GET, POST, PUT, PATCH, DELETE)
   - REST API principles

5. **[EXAMPLES.md](EXAMPLES.md)** 📋
   - Real-world API examples
   - Request/response demonstrations
   - All endpoints showcased

### 🚀 Recommended Learning Path

**Beginner → Intermediate → Advanced**

1. Start with [LEARNING_GUIDE.md](LEARNING_GUIDE.md) - Master fundamentals
2. Run examples from [EXAMPLES.md](EXAMPLES.md) - Practice with curl/Postman
3. Study [ADVANCED_TOPICS.md](ADVANCED_TOPICS.md) - Learn 1-2 topics at a time
4. Implement from [ADVANCED_IMPLEMENTATION.md](ADVANCED_IMPLEMENTATION.md) - Copy & modify code
5. Use [CHEAT_SHEET.md](CHEAT_SHEET.md) - Quick lookups & patterns

### 📊 Topics Covered

```
Error Handling          ████████████████░░░░ Intermediate
Middleware              ████████████████░░░░ Intermediate
Authentication         ████████████████████ Advanced
Async/Await             ████████████░░░░░░░░ Beginner+
Logging                 ████████████░░░░░░░░ Beginner+
Rate Limiting           ████████████████░░░░ Intermediate
Caching                 ████████████████░░░░ Intermediate
API Versioning          ████████████░░░░░░░░ Intermediate
Testing                 ████████████████░░░░ Intermediate
Performance             ████████████████░░░░ Intermediate
Security                ████████████████████ Advanced
Databases               ████████████░░░░░░░░ Intermediate
```

### 💡 Quick Start: What to Learn Next

**If you want to...**

- Handle errors gracefully → Read [Error Handling](ADVANCED_TOPICS.md#error-handling--validation) in ADVANCED_TOPICS.md
- Create middleware → See [Custom Middleware](ADVANCED_TOPICS.md#custom-middleware) + [Implementation](ADVANCED_IMPLEMENTATION.md#custom-middleware-suite)
- Add user login → Study [Authentication](ADVANCED_TOPICS.md#authentication--authorization) + [Code Example](ADVANCED_IMPLEMENTATION.md#authentication-system)
- Speed up queries → Check [Filtering & Pagination](ADVANCED_TOPICS.md#performance-optimization) + [Query Builder](ADVANCED_IMPLEMENTATION.md#advanced-filtering--pagination)
- Protect your API → Review [Security Best Practices](ADVANCED_TOPICS.md#security-best-practices)
- Store data permanently → Explore [Database Integration](ADVANCED_TOPICS.md#database-integration)

---

## 📚 Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

---

Happy Learning! 🚀
