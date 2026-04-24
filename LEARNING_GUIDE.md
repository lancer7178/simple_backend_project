# Node.js Backend Learning Guide

## 🎯 What You'll Learn

This project teaches you the fundamentals of backend development using Node.js and Express.

---

## 📖 Key Concepts Explained

### 1. **Node.js**

Node.js is a JavaScript runtime that allows you to run JavaScript on the server side (not just in browsers).

**Key Points:**

- Event-driven, non-blocking I/O
- Single-threaded but asynchronous
- Great for building fast, scalable applications

### 2. **Express.js**

Express is a minimal and flexible web framework that makes it easy to build REST APIs.

**Key Points:**

- Middleware system for processing requests
- Simple routing
- Easy to extend

### 3. **REST API (Representational State Transfer)**

REST is a architectural style for building web services.

**REST Principles:**

- Client-Server: Separation of concerns
- Stateless: Each request contains all needed info
- Resources: Use URLs to represent resources
- HTTP Methods: Use HTTP methods for operations

### 4. **HTTP Methods (CRUD Operations)**

#### GET - Read Data

```javascript
app.get("/api/items/:id", (req, res) => {
  // Fetch and return data
});
```

- **Idempotent**: Multiple calls don't change server state
- **Safe**: Doesn't modify data
- **Cacheable**: Responses can be cached
- **Query Parameters**: Pass data in URL (`?page=1&limit=10`)

#### POST - Create Data

```javascript
app.post("/api/items", (req, res) => {
  // Create new resource
});
```

- **Not Idempotent**: Multiple calls create multiple resources
- **Not Safe**: Modifies server state
- **Request Body**: Data sent in request body (JSON)

#### PUT - Complete Update

```javascript
app.put("/api/items/:id", (req, res) => {
  // Replace entire resource
});
```

- **Idempotent**: Calling multiple times produces same result
- **Replaces**: Replaces entire resource (all fields required)
- **Request Body**: New complete data

#### PATCH - Partial Update

```javascript
app.patch("/api/items/:id", (req, res) => {
  // Update specific fields only
});
```

- **Idempotent**: Usually idempotent (application-dependent)
- **Partial**: Update only provided fields
- **Request Body**: Only changed fields needed

#### DELETE - Remove Data

```javascript
app.delete("/api/items/:id", (req, res) => {
  // Remove resource
});
```

- **Idempotent**: Calling multiple times has same effect
- **Removes**: Deletes the resource

---

## 🔄 Request-Response Cycle

```
Client (Browser/Postman)
    ↓
sends HTTP Request (GET, POST, PUT, PATCH, DELETE)
    ↓
Express Routes Handler
    ↓
Processing (business logic)
    ↓
sends HTTP Response (status code + data)
    ↓
Client receives Response
```

### Request Structure

```
METHOD /path/to/resource HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "key": "value"
}
```

### Response Structure

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": { ... }
}
```

---

## 📊 Middleware Explained

Middleware are functions that have access to request, response, and next middleware.

```javascript
app.use(express.json()); // Parses incoming JSON requests
app.use(cors()); // Enables CORS (cross-origin requests)
```

**Middleware Flow:**

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

---

## 🔍 Understanding req and res Objects

### req (Request)

Contains information about the HTTP request:

```javascript
req.params; // URL parameters: /items/:id → req.params.id
req.query; // Query strings: ?page=1 → req.query.page
req.body; // Request body (JSON/form data)
req.headers; // HTTP headers
req.method; // HTTP method (GET, POST, etc.)
req.path; // URL path
```

### res (Response)

Methods to send response to client:

```javascript
res.status(200); // Set HTTP status code
res.json({ data }); // Send JSON response
res.send("text"); // Send text response
res.redirect("/path"); // Redirect to another URL
res.sendFile(path); // Send file
```

---

## 🎓 Code Walkthrough

### Route Handler Pattern

```javascript
app.METHOD("/path/:param", (req, res) => {
  // Extract data from request
  const { id } = req.params;
  const { title } = req.body;

  // Process data
  const item = findItemById(id);

  // Send response
  res.status(200).json({
    success: true,
    data: item,
  });
});
```

### Error Handling

```javascript
// Validate input
if (!title) {
  return res.status(400).json({
    success: false,
    message: "Title is required",
  });
}

// Handle not found
if (!item) {
  return res.status(404).json({
    success: false,
    message: "Item not found",
  });
}
```

---

## 📚 HTTP Status Codes Reference

### 2xx - Success

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Successful, but no content to return

### 4xx - Client Error

- **400 Bad Request**: Invalid request (validation error)
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Request conflicts with current state

### 5xx - Server Error

- **500 Internal Server Error**: Unexpected error
- **503 Service Unavailable**: Server temporarily unavailable

---

## 💡 Best Practices

### 1. **Consistent Response Format**

Always return responses in a consistent format:

```json
{
  "success": true,
  "message": "Description",
  "data": {},
  "error": null
}
```

### 2. **Proper Status Codes**

Use appropriate HTTP status codes for different scenarios.

### 3. **Input Validation**

Always validate data before processing:

```javascript
if (!title || typeof title !== "string") {
  return res.status(400).json({ error: "Invalid title" });
}
```

### 4. **Error Handling**

Always handle errors gracefully:

```javascript
try {
  // code
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

### 5. **Meaningful URLs**

- ✅ `/api/items` - Collection
- ✅ `/api/items/1` - Specific item
- ❌ `/api/get-item-by-id` - Method in URL (bad)
- ❌ `/api/item?id=1` - For one-to-many relationship (okay)

### 6. **Versioning**

Keep APIs backward compatible or version them:

```javascript
app.get('/api/v1/items', ...);
app.get('/api/v2/items', ...);
```

---

## 🚀 Next Learning Steps

1. **Databases**: Replace in-memory array with MongoDB/PostgreSQL
2. **Authentication**: Add JWT or session-based auth
3. **Middleware**: Create custom middleware
4. **Async/Await**: Learn asynchronous JavaScript
5. **Error Handling**: Implement comprehensive error handling
6. **Testing**: Write unit and integration tests
7. **Deployment**: Deploy to Heroku, AWS, or other platforms

---

## 🔗 Useful Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **Express Guide**: https://expressjs.com/
- **MDN HTTP**: https://developer.mozilla.org/en-US/docs/Web/HTTP
- **REST Best Practices**: https://restfulapi.net/

---

Happy Learning! 🎉
