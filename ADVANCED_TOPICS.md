# 🚀 Advanced Node.js Backend Topics

This guide covers advanced concepts to take your backend development to the next level.

---

## 📑 Table of Contents

1. [Error Handling & Validation](#error-handling--validation)
2. [Custom Middleware](#custom-middleware)
3. [Authentication & Authorization](#authentication--authorization)
4. [Async/Await Patterns](#asyncawait-patterns)
5. [Request Logging & Debugging](#request-logging--debugging)
6. [Rate Limiting](#rate-limiting)
7. [Caching Strategies](#caching-strategies)
8. [API Versioning](#api-versioning)
9. [Testing Your API](#testing-your-api)
10. [Performance Optimization](#performance-optimization)
11. [Security Best Practices](#security-best-practices)
12. [Database Integration](#database-integration)

---

## 🛡️ Error Handling & Validation

### What is Error Handling?

Error handling is the process of responding gracefully to errors in your application. Instead of crashing, your API should return meaningful error messages to the client.

### Basic Try-Catch Pattern

```javascript
app.get("/api/items/:id", (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      // Validation: ID must be a number
      return res.status(400).json({
        success: false,
        message: "Invalid ID format. ID must be a number.",
        error: "INVALID_ID",
      });
    }

    // Your logic here
    const item = items.find((i) => i.id === parseInt(id));

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${id} not found`,
        error: "NOT_FOUND",
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
```

### Global Error Handler (Middleware)

```javascript
// Create a centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err.type || "UNKNOWN_ERROR",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Use it last (after all other middleware and routes)
app.use(errorHandler);
```

### Input Validation with a Validator Function

```javascript
// Helper function to validate input
function validateItem(item) {
  const errors = [];

  if (!item.title || item.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!item.description || item.description.trim() === "") {
    errors.push("Description is required");
  }

  if (typeof item.completed !== "boolean") {
    errors.push("Completed must be a boolean");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

// Usage in POST route
app.post("/api/items", (req, res) => {
  const validation = validateItem(req.body);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  // Create item...
  res.status(201).json({ success: true, data: newItem });
});
```

---

## 🔧 Custom Middleware

### What is Middleware?

Middleware are functions that execute during the request-response cycle. They can:

- Modify `req` and `res` objects
- End the request-response cycle
- Call the next middleware function

### Logging Middleware

```javascript
// Logs all incoming requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next(); // Pass to next middleware
};

app.use(requestLogger);
```

### Request Timer Middleware

```javascript
// Measures how long each request takes
const requestTimer = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });

  next();
};

app.use(requestTimer);
```

### Request Size Limit Middleware

```javascript
// Limits request body size to prevent abuse
const requestSizeLimit = (req, res, next) => {
  const maxSize = 1024 * 1024; // 1MB
  let size = 0;

  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > maxSize) {
      res.status(413).json({
        success: false,
        message: "Request body too large",
      });
    } else {
      next();
    }
  });
};
```

### Authentication Middleware

```javascript
// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  // In real app, verify JWT token here
  if (token === "valid-token") {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Use on specific routes
app.delete("/api/items/:id", isAuthenticated, (req, res) => {
  // Delete logic...
});
```

---

## 🔐 Authentication & Authorization

### What's the Difference?

- **Authentication**: Verifying WHO the user is (login)
- **Authorization**: Verifying WHAT the user can do (permissions)

### JWT (JSON Web Token) Basics

JWT is a token-based authentication method. Structure: `header.payload.signature`

```javascript
// Simulated JWT generation (use 'jsonwebtoken' package in production)
const generateToken = (userId) => {
  // In production: const jwt = require('jsonwebtoken');
  // return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Simple example (NOT secure, for learning only)
  return Buffer.from(
    JSON.stringify({
      userId,
      iat: Date.now(),
    }),
  ).toString("base64");
};

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
```

### Role-Based Authorization

```javascript
// Check if user has required role
const requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Usage
app.delete(
  "/api/items/:id",
  verifyToken,
  requireRole(["admin"]),
  (req, res) => {
    // Delete logic - only admins can delete
  },
);
```

---

## ⏳ Async/Await Patterns

### What is Async/Await?

Async/Await is a cleaner way to handle asynchronous code compared to callbacks or `.then()` chains.

```javascript
// OLD WAY - Callback Hell
app.get("/api/items", (req, res) => {
  getItemsFromDatabase((err, items) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.json(items);
    }
  });
});

// OLD WAY - Promise chains
app.get("/api/items", (req, res) => {
  getItemsFromDatabase()
    .then((items) => res.json(items))
    .catch((err) => res.status(500).json({ error: err }));
});

// MODERN WAY - Async/Await
app.get("/api/items", async (req, res) => {
  try {
    const items = await getItemsFromDatabase();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Sequential vs Parallel Operations

```javascript
// SEQUENTIAL - Slower (waits for each to complete)
app.get("/api/combined", async (req, res) => {
  try {
    const movies = await getMovies();
    const actors = await getActors();
    const directors = await getDirectors();

    res.json({ movies, actors, directors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PARALLEL - Faster (runs all at once)
app.get("/api/combined", async (req, res) => {
  try {
    const [movies, actors, directors] = await Promise.all([
      getMovies(),
      getActors(),
      getDirectors(),
    ]);

    res.json({ movies, actors, directors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📊 Request Logging & Debugging

### Morgan - HTTP Request Logger

```javascript
// Popular logging middleware
// npm install morgan

const morgan = require("morgan");

// Log all requests
app.use(morgan("combined"));

// Custom logging format
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
```

### Debug Middleware

```javascript
// Track request journey
const debugMiddleware = (req, res, next) => {
  console.log("\n=== REQUEST DEBUG ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Query:", req.query);
  console.log("Params:", req.params);
  console.log("===================\n");

  next();
};

app.use(debugMiddleware);
```

### Response Interceptor

```javascript
// Log responses
const responseLogger = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    console.log("RESPONSE:", data);
    return originalJson.call(this, data);
  };

  next();
};

app.use(responseLogger);
```

---

## ⏱️ Rate Limiting

### What is Rate Limiting?

Rate limiting restricts the number of requests a client can make in a given time period. This prevents abuse and DDoS attacks.

### Simple In-Memory Rate Limiter

```javascript
const requestCounts = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }

    // Remove old requests outside the window
    const timestamps = requestCounts.get(key);
    const validRequests = timestamps.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }

    validRequests.push(now);
    requestCounts.set(key, validRequests);
    next();
  };
};

// Apply rate limiting: 100 requests per minute
app.use(rateLimit(100, 60000));
```

### Using express-rate-limit Package

```javascript
// npm install express-rate-limit

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply globally
app.use(limiter);

// Or apply to specific routes
app.post("/api/items", limiter, (req, res) => {
  // Create item...
});
```

---

## 💾 Caching Strategies

### What is Caching?

Caching stores frequently accessed data temporarily to reduce database queries and improve performance.

### In-Memory Cache

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cacheMiddleware = (req, res, next) => {
  if (req.method !== "GET") {
    return next();
  }

  const key = req.url;
  const cachedData = cache.get(key);

  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    console.log("Cache hit:", key);
    return res.json(cachedData.data);
  }

  // Override res.json to cache the response
  const originalJson = res.json;
  res.json = function (data) {
    cache.set(key, { data, timestamp: Date.now() });
    return originalJson.call(this, data);
  };

  next();
};

app.use(cacheMiddleware);
```

### Cache Invalidation

```javascript
// Clear cache when data changes
const clearCache = () => {
  cache.clear();
  console.log("Cache cleared");
};

app.post("/api/items", (req, res) => {
  // Create item...
  clearCache();
  res.status(201).json({ success: true });
});

app.put("/api/items/:id", (req, res) => {
  // Update item...
  clearCache();
  res.json({ success: true });
});
```

### HTTP Caching Headers

```javascript
// Tell browser/clients to cache responses
app.get("/api/items", (req, res) => {
  res.set("Cache-Control", "public, max-age=300"); // Cache for 5 minutes
  res.json({ data: movies });
});

// Don't cache sensitive data
app.get("/api/user/profile", (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.json({ data: userProfile });
});
```

---

## 🔄 API Versioning

### What is API Versioning?

Versioning allows you to make breaking changes to your API while maintaining backward compatibility with older clients.

### URL Path Versioning

```javascript
// Version 1
app.get("/api/v1/items", (req, res) => {
  // Old format
  res.json({
    items: movies,
  });
});

// Version 2 (Breaking change)
app.get("/api/v2/items", (req, res) => {
  // New format with more details
  res.json({
    success: true,
    data: movies,
    version: "2.0.0",
    timestamp: new Date(),
  });
});
```

### Header-Based Versioning

```javascript
// Client sends: Accept: application/vnd.myapi.v1+json

app.get("/api/items", (req, res) => {
  const version = req.headers["accept"]?.includes("v2") ? "2" : "1";

  if (version === "2") {
    res.json({
      success: true,
      data: movies,
    });
  } else {
    res.json({
      items: movies,
    });
  }
});
```

---

## 🧪 Testing Your API

### Manual Testing with curl

```bash
# GET request
curl http://localhost:3000/api/items

# GET with parameters
curl "http://localhost:3000/api/items?page=1&limit=10"

# POST request
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"New Item","description":"Test","completed":false}'

# PUT request
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","description":"Test","completed":true}'

# DELETE request
curl -X DELETE http://localhost:3000/api/items/1

# With authentication header
curl -H "Authorization: Bearer your-token-here" \
  http://localhost:3000/api/protected
```

### Unit Testing with Jest

```javascript
// items.test.js
// npm install --save-dev jest supertest

const request = require("supertest");
const app = require("./server");

describe("GET /api/items", () => {
  it("should return all items", async () => {
    const response = await request(app).get("/api/items");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe("POST /api/items", () => {
  it("should create a new item", async () => {
    const newItem = {
      title: "Test Item",
      description: "Test Description",
      completed: false,
    };

    const response = await request(app).post("/api/items").send(newItem);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## ⚡ Performance Optimization

### Pagination

```javascript
app.get("/api/items", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const paginatedItems = movies.slice(skip, skip + limit);

  res.json({
    success: true,
    data: paginatedItems,
    pagination: {
      currentPage: page,
      limit: limit,
      total: movies.length,
      pages: Math.ceil(movies.length / limit),
    },
  });
});
```

### Filtering & Sorting

```javascript
app.get("/api/items", (req, res) => {
  let filtered = movies;

  // Filter by genre
  if (req.query.genre) {
    filtered = filtered.filter((m) => m.genre.includes(req.query.genre));
  }

  // Filter by year
  if (req.query.year) {
    filtered = filtered.filter(
      (m) => m.releaseYear === parseInt(req.query.year),
    );
  }

  // Sort
  if (req.query.sort === "rating") {
    filtered.sort((a, b) => b.imdbRating - a.imdbRating);
  }

  if (req.query.sort === "year") {
    filtered.sort((a, b) => b.releaseYear - a.releaseYear);
  }

  res.json({ success: true, data: filtered });
});

// Usage:
// GET /api/items?genre=Action&sort=rating
// GET /api/items?year=2019&limit=5
```

### Compression

```javascript
// npm install compression

const compression = require("compression");
app.use(compression());

// Compresses responses (gzip, deflate)
```

---

## 🔒 Security Best Practices

### 1. Helmet - Secure HTTP Headers

```javascript
// npm install helmet

const helmet = require("helmet");
app.use(helmet());

// Sets various HTTP headers for security:
// - X-Frame-Options (clickjacking protection)
// - X-Content-Type-Options (MIME sniffing protection)
// - Strict-Transport-Security (HTTPS enforcement)
```

### 2. Input Sanitization

```javascript
// Prevent injection attacks
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

app.post("/api/items", (req, res) => {
  const safeTitle = sanitizeInput(req.body.title);
  // Use safeTitle...
});
```

### 3. Environment Variables

```javascript
// Never hardcode secrets!
require("dotenv").config();

const SECRET = process.env.JWT_SECRET;
const DB_URL = process.env.DATABASE_URL;

if (!SECRET || !DB_URL) {
  throw new Error("Missing required environment variables");
}
```

### 4. SQL Injection Prevention

```javascript
// BAD - Vulnerable to SQL injection
const badQuery = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD - Use parameterized queries
const goodQuery = "SELECT * FROM users WHERE id = ?";
// Pass userId separately - database driver handles escaping
database.query(goodQuery, [userId]);
```

### 5. CORS Configuration

```javascript
// Be specific about allowed origins
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

## 🗄️ Database Integration

### Why Databases?

So far we've used in-memory storage (loses data on restart). Real apps need persistent storage.

### MongoDB Example (NoSQL)

```javascript
// npm install mongoose

const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL);

// Define schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create item
app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

### PostgreSQL Example (SQL)

```javascript
// npm install pg

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create item
app.post("/api/items", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const result = await pool.query(
      "INSERT INTO items (title, description, completed) VALUES ($1, $2, $3) RETURNING *",
      [title, description, completed],
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

---

## 📝 Summary Table

| Topic          | Purpose                       | Complexity   |
| -------------- | ----------------------------- | ------------ |
| Error Handling | Handle errors gracefully      | Beginner     |
| Middleware     | Process requests              | Beginner     |
| Authentication | Verify user identity          | Intermediate |
| Async/Await    | Handle async operations       | Intermediate |
| Logging        | Track application behavior    | Beginner     |
| Rate Limiting  | Prevent abuse                 | Intermediate |
| Caching        | Improve performance           | Intermediate |
| Versioning     | Support multiple API versions | Intermediate |
| Testing        | Verify functionality          | Intermediate |
| Performance    | Optimize speed                | Intermediate |
| Security       | Protect against attacks       | Advanced     |
| Databases      | Persist data                  | Intermediate |

---

## 🎯 Next Steps

1. **Pick ONE topic** to master first
2. **Implement it** in your code
3. **Test it thoroughly**
4. **Move to the next topic**

**Recommended Learning Path:**

1. Error Handling & Validation
2. Custom Middleware
3. Authentication
4. Testing
5. Database Integration
6. Security Best Practices
7. Performance Optimization

Happy Learning! 🚀
