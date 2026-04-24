# 📋 API Examples & Responses

Real-world examples of all API endpoints with expected responses.

---

## 🔵 GET Requests

### Example 1: Get All Items

**Request:**

```bash
curl http://localhost:3000/api/items
```

**Response (200 OK):**

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
    },
    {
      "id": 2,
      "title": "Learn Express",
      "description": "Build REST APIs",
      "completed": true
    },
    {
      "id": 3,
      "title": "Learn Databases",
      "description": "Work with databases",
      "completed": false
    }
  ],
  "count": 3
}
```

---

### Example 2: Get Specific Item (Success)

**Request:**

```bash
curl http://localhost:3000/api/items/1
```

**Response (200 OK):**

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

### Example 3: Get Non-existent Item (Error)

**Request:**

```bash
curl http://localhost:3000/api/items/999
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Item with ID 999 not found"
}
```

---

## 🟢 POST Request - Create

### Example: Create New Item

**Request:**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn MongoDB",
    "description": "Database for Node.js backends"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "id": 4,
    "title": "Learn MongoDB",
    "description": "Database for Node.js backends",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Example: Create with Missing Fields (Validation Error)

**Request:**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript"
  }'
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Title and description are required"
}
```

---

## 🟠 PUT Request - Complete Update

### Example: Update Entire Item

**Request:**

```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Master Node.js",
    "description": "Become an expert in backend development",
    "completed": true
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "title": "Master Node.js",
    "description": "Become an expert in backend development",
    "completed": true,
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Example: Update Non-existent Item

**Request:**

```bash
curl -X PUT http://localhost:3000/api/items/999 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Update",
    "description": "Update"
  }'
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Item with ID 999 not found"
}
```

---

## 🟡 PATCH Request - Partial Update

### Example 1: Update Only Title

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Node.js Concepts"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Item partially updated successfully",
  "data": {
    "id": 1,
    "title": "Advanced Node.js Concepts",
    "description": "Understand backend development",
    "completed": false,
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

Notice: description and completed remain unchanged!

---

### Example 2: Update Only Completed Status

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/items/2 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Item partially updated successfully",
  "data": {
    "id": 2,
    "title": "Learn Express",
    "description": "Build REST APIs",
    "completed": true,
    "updatedAt": "2024-01-15T10:45:00.000Z"
  }
}
```

Notice: title and description remain unchanged!

---

### Example 3: Update Multiple Fields

**Request:**

```bash
curl -X PATCH http://localhost:3000/api/items/3 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Learning",
    "completed": true
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Item partially updated successfully",
  "data": {
    "id": 3,
    "title": "Complete Learning",
    "description": "Work with databases",
    "completed": true,
    "updatedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

---

## 🔴 DELETE Request

### Example: Delete Item (Success)

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/items/1
```

**Response (200 OK):**

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

After this request, item with ID 1 is permanently removed!

---

### Example: Delete Non-existent Item

**Request:**

```bash
curl -X DELETE http://localhost:3000/api/items/999
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Item with ID 999 not found"
}
```

---

## 🏠 Health Check

**Request:**

```bash
curl http://localhost:3000
```

**Response (200 OK):**

```json
{
  "message": "Welcome to Simple Node.js Backend API",
  "version": "1.0.0",
  "endpoints": {
    "GET /api/items": "Get all items",
    "GET /api/items/:id": "Get item by ID",
    "POST /api/items": "Create new item",
    "PUT /api/items/:id": "Update entire item",
    "PATCH /api/items/:id": "Partially update item",
    "DELETE /api/items/:id": "Delete item"
  }
}
```

---

## 📊 Response Status Codes Reference

| Code    | Scenario                        | Example Response          |
| ------- | ------------------------------- | ------------------------- |
| **200** | GET/PUT/PATCH/DELETE successful | Item found and returned   |
| **201** | POST successful                 | Item created and returned |
| **400** | Invalid request data            | Missing required fields   |
| **404** | Resource not found              | Item ID doesn't exist     |
| **500** | Server error                    | Unexpected server error   |

---

## 🧪 Testing Workflow

### Complete CRUD Cycle

1. **Create (POST)** - Create a new item

   ```bash
   curl -X POST http://localhost:3000/api/items \
     -H "Content-Type: application/json" \
     -d '{"title":"New Item","description":"Test item"}'
   ```

   - Save the returned ID (e.g., 5)

2. **Read (GET)** - Get the created item

   ```bash
   curl http://localhost:3000/api/items/5
   ```

3. **Update (PUT)** - Replace the entire item

   ```bash
   curl -X PUT http://localhost:3000/api/items/5 \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Item","description":"Updated","completed":true}'
   ```

4. **Partial Update (PATCH)** - Change just one field

   ```bash
   curl -X PATCH http://localhost:3000/api/items/5 \
     -H "Content-Type: application/json" \
     -d '{"completed":false}'
   ```

5. **Delete (DELETE)** - Remove the item

   ```bash
   curl -X DELETE http://localhost:3000/api/items/5
   ```

6. **Verify Deletion (GET)** - Confirm it's gone
   ```bash
   curl http://localhost:3000/api/items/5
   ```

   - Should return 404 error

---

## 💡 Pro Tips

1. **Use curl -i flag to see headers:**

   ```bash
   curl -i http://localhost:3000/api/items
   ```

2. **Pretty print JSON with jq (on Mac/Linux):**

   ```bash
   curl http://localhost:3000/api/items | jq
   ```

3. **Save response to file:**

   ```bash
   curl http://localhost:3000/api/items > response.json
   ```

4. **Use Postman or REST Client for easier testing**

---

Happy Testing! 🎉
