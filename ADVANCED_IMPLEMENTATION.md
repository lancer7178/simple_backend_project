# 💻 Advanced Implementation Examples

Practical code examples showing how to implement advanced features in your Node.js backend.

---

## Table of Contents

1. [Complete Server with Error Handling](#complete-server-with-error-handling)
2. [Custom Middleware Suite](#custom-middleware-suite)
3. [Authentication System](#authentication-system)
4. [Advanced Filtering & Pagination](#advanced-filtering--pagination)
5. [Logging System](#logging-system)
6. [Rate Limiting Implementation](#rate-limiting-implementation)

---

## Complete Server with Error Handling

### `server-advanced.js`

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ============= MIDDLEWARE =============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= IN-MEMORY DATA =============
let movies = [
  {
    id: 1,
    title: "Iron Man",
    releaseYear: 2008,
    director: "Jon Favreau",
    genre: ["Action", "Adventure", "Sci-Fi"],
    imdbRating: 7.9,
  },
  {
    id: 2,
    title: "The Avengers",
    releaseYear: 2012,
    director: "Joss Whedon",
    genre: ["Action", "Adventure"],
    imdbRating: 8.0,
  },
];

let nextId = movies.length + 1;

// ============= VALIDATION FUNCTIONS =============

/**
 * Validates movie data
 * @param {Object} movie - Movie object to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
function validateMovie(movie) {
  const errors = [];

  if (
    !movie.title ||
    typeof movie.title !== "string" ||
    movie.title.trim() === ""
  ) {
    errors.push("Title is required and must be a string");
  }

  if (
    !movie.director ||
    typeof movie.director !== "string" ||
    movie.director.trim() === ""
  ) {
    errors.push("Director is required and must be a string");
  }

  if (!Array.isArray(movie.genre) || movie.genre.length === 0) {
    errors.push("Genre must be an array with at least one item");
  }

  if (
    !Number.isInteger(movie.releaseYear) ||
    movie.releaseYear < 1890 ||
    movie.releaseYear > new Date().getFullYear()
  ) {
    errors.push(
      `Release year must be between 1890 and ${new Date().getFullYear()}`,
    );
  }

  if (movie.imdbRating !== undefined) {
    if (
      typeof movie.imdbRating !== "number" ||
      movie.imdbRating < 0 ||
      movie.imdbRating > 10
    ) {
      errors.push("IMDB rating must be a number between 0 and 10");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============= LOGGING MIDDLEWARE =============

/**
 * Logs incoming requests with details
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};

app.use(requestLogger);

// ============= ERROR HANDLING MIDDLEWARE =============

/**
 * Custom error handler - must be last!
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    error: err.type || "UNKNOWN_ERROR",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// ============= ROUTES =============

/**
 * GET /api/movies - Get all movies with filtering
 * Query params: genre, director, minRating, maxRating, sort, page, limit
 */
app.get("/api/movies", (req, res, next) => {
  try {
    let filtered = [...movies];

    // Filtering
    if (req.query.genre) {
      filtered = filtered.filter((m) =>
        m.genre.some((g) =>
          g.toLowerCase().includes(req.query.genre.toLowerCase()),
        ),
      );
    }

    if (req.query.director) {
      filtered = filtered.filter((m) =>
        m.director.toLowerCase().includes(req.query.director.toLowerCase()),
      );
    }

    if (req.query.minRating) {
      const minRating = parseFloat(req.query.minRating);
      if (!isNaN(minRating)) {
        filtered = filtered.filter((m) => m.imdbRating >= minRating);
      }
    }

    if (req.query.maxRating) {
      const maxRating = parseFloat(req.query.maxRating);
      if (!isNaN(maxRating)) {
        filtered = filtered.filter((m) => m.imdbRating <= maxRating);
      }
    }

    // Sorting
    if (req.query.sort === "rating-asc") {
      filtered.sort((a, b) => a.imdbRating - b.imdbRating);
    } else if (req.query.sort === "rating-desc") {
      filtered.sort((a, b) => b.imdbRating - a.imdbRating);
    } else if (req.query.sort === "year-asc") {
      filtered.sort((a, b) => a.releaseYear - b.releaseYear);
    } else if (req.query.sort === "year-desc") {
      filtered.sort((a, b) => b.releaseYear - a.releaseYear);
    }

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const paginated = filtered.slice(skip, skip + limit);

    res.json({
      success: true,
      message: "Movies retrieved successfully",
      data: paginated,
      pagination: {
        currentPage: page,
        limit,
        total: filtered.length,
        pages: Math.ceil(filtered.length / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/movies/:id - Get specific movie
 */
app.get("/api/movies/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("Invalid movie ID. Must be a number.");
      error.statusCode = 400;
      error.type = "INVALID_ID";
      throw error;
    }

    const movie = movies.find((m) => m.id === id);

    if (!movie) {
      const error = new Error(`Movie with ID ${id} not found`);
      error.statusCode = 404;
      error.type = "NOT_FOUND";
      throw error;
    }

    res.json({
      success: true,
      message: "Movie retrieved successfully",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/movies - Create new movie
 */
app.post("/api/movies", (req, res, next) => {
  try {
    const validation = validateMovie(req.body);

    if (!validation.isValid) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.type = "VALIDATION_ERROR";
      error.details = validation.errors;
      throw error;
    }

    const newMovie = {
      id: nextId++,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    movies.push(newMovie);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/movies/:id - Update entire movie
 */
app.put("/api/movies/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("Invalid movie ID. Must be a number.");
      error.statusCode = 400;
      throw error;
    }

    const validation = validateMovie(req.body);
    if (!validation.isValid) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const movieIndex = movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) {
      const error = new Error(`Movie with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    movies[movieIndex] = {
      id,
      ...req.body,
      createdAt: movies[movieIndex].createdAt,
      updatedAt: new Date(),
    };

    res.json({
      success: true,
      message: "Movie updated successfully",
      data: movies[movieIndex],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/movies/:id - Partial update
 */
app.patch("/api/movies/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("Invalid movie ID");
      error.statusCode = 400;
      throw error;
    }

    const movieIndex = movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) {
      const error = new Error(`Movie with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    // Only update provided fields
    const updated = {
      ...movies[movieIndex],
      ...req.body,
      id, // Don't allow ID change
      createdAt: movies[movieIndex].createdAt,
      updatedAt: new Date(),
    };

    // Validate the updated object
    const validation = validateMovie(updated);
    if (!validation.isValid) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    movies[movieIndex] = updated;

    res.json({
      success: true,
      message: "Movie partially updated",
      data: movies[movieIndex],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/movies/:id - Delete movie
 */
app.delete("/api/movies/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      const error = new Error("Invalid movie ID");
      error.statusCode = 400;
      throw error;
    }

    const movieIndex = movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) {
      const error = new Error(`Movie with ID ${id} not found`);
      error.statusCode = 404;
      throw error;
    }

    const deleted = movies.splice(movieIndex, 1)[0];

    res.json({
      success: true,
      message: "Movie deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// ============= 404 HANDLER =============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// ============= ERROR HANDLER (MUST BE LAST) =============
app.use(errorHandler);

// ============= START SERVER =============
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
```

---

## Custom Middleware Suite

### `middleware/index.js`

```javascript
/**
 * Collection of custom middleware functions
 */

// Request Timer
exports.requestTimer = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const durationColor = duration > 1000 ? "🔴" : duration > 500 ? "🟡" : "🟢";
    console.log(`${durationColor} ${req.method} ${req.path} - ${duration}ms`);
  });

  next();
};

// Request Logger
exports.requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);

  if (Object.keys(req.query).length > 0) {
    console.log("Query:", req.query);
  }

  if (Object.keys(req.body).length > 0) {
    console.log("Body:", req.body);
  }

  next();
};

// JSON Parser Error Handler
exports.jsonErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON in request body",
      error: err.message,
    });
  }
  next();
};

// Authentication (Simple Token Check)
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Send token in Authorization header.",
    });
  }

  // In production, verify JWT token
  if (token === "test-token") {
    req.user = { id: 1, role: "user" };
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Role-based Authorization
exports.authorize = (requiredRoles) => {
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
        message: "Insufficient permissions for this action",
      });
    }

    next();
  };
};

// Request Size Validation
exports.validateRequestSize = (maxSize = 10 * 1024) => {
  return (req, res, next) => {
    let size = 0;

    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxSize) {
        res.status(413).json({
          success: false,
          message: "Request body too large",
          maxSize,
          received: size,
        });
      }
    });

    req.on("end", () => {
      next();
    });
  };
};

// CORS Middleware (Custom)
exports.customCors = (allowedOrigins) => {
  return (req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }

    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }

    next();
  };
};

// Security Headers
exports.securityHeaders = (req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );
  next();
};
```

---

## Authentication System

### `auth/auth.js`

```javascript
/**
 * Authentication and Authorization System
 */

// Simple in-memory user store (replace with database in production)
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
];

/**
 * Validate login credentials
 */
exports.validateCredentials = (username, password) => {
  if (!username || !password) {
    return { isValid: false, error: "Username and password required" };
  }

  if (username.length < 3) {
    return { isValid: false, error: "Username must be at least 3 characters" };
  }

  if (password.length < 6) {
    return { isValid: false, error: "Password must be at least 6 characters" };
  }

  return { isValid: true };
};

/**
 * Find user by credentials
 */
exports.findUserByCredentials = (username, password) => {
  return users.find((u) => u.username === username && u.password === password);
};

/**
 * Find user by ID
 */
exports.findUserById = (id) => {
  return users.find((u) => u.id === id);
};

/**
 * Generate simple token (use JWT in production!)
 */
exports.generateToken = (userId) => {
  // In production, use jsonwebtoken package
  // const jwt = require('jsonwebtoken');
  // return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });

  return Buffer.from(
    JSON.stringify({
      userId,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }),
  ).toString("base64");
};

/**
 * Verify token
 */
exports.verifyToken = (token) => {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    if (decoded.exp < Date.now()) {
      return { isValid: false, error: "Token expired" };
    }

    return { isValid: true, userId: decoded.userId };
  } catch (error) {
    return { isValid: false, error: "Invalid token" };
  }
};
```

### `auth/routes.js`

```javascript
/**
 * Authentication routes
 */

const express = require("express");
const router = express.Router();
const auth = require("./auth");

/**
 * POST /auth/login - User login
 */
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const validation = auth.validateCredentials(username, password);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    // Find user
    const user = auth.findUserByCredentials(username, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate token
    const token = auth.generateToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * POST /auth/verify - Verify token
 */
router.post("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const verification = auth.verifyToken(token);

    if (!verification.isValid) {
      return res.status(401).json({
        success: false,
        message: verification.error,
      });
    }

    const user = auth.findUserById(verification.userId);

    res.json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * GET /auth/me - Get current user info
 */
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  res.json({
    success: true,
    data: req.user,
  });
});

module.exports = router;
```

---

## Advanced Filtering & Pagination

### `utils/queryBuilder.js`

```javascript
/**
 * Advanced query builder for filtering, sorting, and pagination
 */

class QueryBuilder {
  constructor(data) {
    this.data = data;
    this.filtered = [...data];
    this.totalCount = data.length;
  }

  /**
   * Filter by field equality or array inclusion
   */
  filter(field, value) {
    if (!value) return this;

    this.filtered = this.filtered.filter((item) => {
      const fieldValue = item[field];

      if (Array.isArray(fieldValue)) {
        return fieldValue.some(
          (v) => v.toLowerCase?.() === value.toLowerCase?.() || v === value,
        );
      }

      return fieldValue?.toString().toLowerCase() === value.toLowerCase?.();
    });

    return this;
  }

  /**
   * Filter by range (min/max)
   */
  filterRange(field, min, max) {
    this.filtered = this.filtered.filter((item) => {
      const value = item[field];
      if (min && value < min) return false;
      if (max && value > max) return false;
      return true;
    });

    return this;
  }

  /**
   * Filter by search term (searches multiple fields)
   */
  search(term, fields) {
    if (!term) return this;

    const searchTerm = term.toLowerCase();
    this.filtered = this.filtered.filter((item) =>
      fields.some((field) =>
        item[field]?.toString().toLowerCase().includes(searchTerm),
      ),
    );

    return this;
  }

  /**
   * Sort by field
   */
  sort(field, order = "asc") {
    this.filtered.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    return this;
  }

  /**
   * Paginate results
   */
  paginate(page = 1, limit = 10) {
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(100, Math.max(1, limit));

    const skip = (pageNum - 1) * limitNum;
    this.paginated = this.filtered.slice(skip, skip + limitNum);

    this.pagination = {
      currentPage: pageNum,
      limit: limitNum,
      total: this.filtered.length,
      pages: Math.ceil(this.filtered.length / limitNum),
      hasNextPage: skip + limitNum < this.filtered.length,
      hasPrevPage: pageNum > 1,
    };

    return this;
  }

  /**
   * Select specific fields
   */
  select(fields) {
    this.paginated = this.paginated.map((item) =>
      fields.reduce((obj, field) => {
        obj[field] = item[field];
        return obj;
      }, {}),
    );

    return this;
  }

  /**
   * Get final result
   */
  build() {
    return {
      data: this.paginated || this.filtered,
      pagination: this.pagination || null,
    };
  }
}

module.exports = QueryBuilder;
```

---

## Logging System

### `logger/logger.js`

```javascript
/**
 * Structured logging system
 */

const fs = require("fs");
const path = require("path");

class Logger {
  constructor(filename = "app.log") {
    this.logFile = path.join(__dirname, "..", "logs", filename);
    this.ensureLogDir();
  }

  ensureLogDir() {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = {}) {
    return JSON.stringify({
      timestamp: this.getTimestamp(),
      level,
      message,
      data,
      pid: process.pid,
    });
  }

  writeLog(level, message, data) {
    const formatted = this.formatMessage(level, message, data);
    console.log(formatted);

    fs.appendFileSync(this.logFile, formatted + "\n", "utf8");
  }

  info(message, data) {
    this.writeLog("INFO", message, data);
  }

  warn(message, data) {
    this.writeLog("WARN", message, data);
  }

  error(message, error, data) {
    this.writeLog("ERROR", message, {
      error: error?.message,
      stack: error?.stack,
      ...data,
    });
  }

  debug(message, data) {
    if (process.env.NODE_ENV === "development") {
      this.writeLog("DEBUG", message, data);
    }
  }
}

module.exports = new Logger();
```

---

## Rate Limiting Implementation

### `utils/rateLimiter.js`

```javascript
/**
 * In-memory rate limiter
 */

class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key, maxRequests = 100, windowMs = 60000) {
    const now = Date.now();

    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const timestamps = this.requests.get(key);

    // Remove old requests
    const validRequests = timestamps.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000),
      };
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);

    return {
      allowed: true,
      remaining: maxRequests - validRequests.length,
      resetTime: validRequests[0] + windowMs,
    };
  }

  /**
   * Express middleware factory
   */
  middleware(maxRequests = 100, windowMs = 60000) {
    return (req, res, next) => {
      const key = req.ip;
      const result = this.isAllowed(key, maxRequests, windowMs);

      res.set("X-RateLimit-Limit", maxRequests);
      res.set("X-RateLimit-Remaining", result.remaining || 0);

      if (!result.allowed) {
        res.set("Retry-After", result.retryAfter);
        return res.status(429).json({
          success: false,
          message: "Too many requests",
          retryAfter: result.retryAfter,
        });
      }

      next();
    };
  }

  /**
   * Clear old entries (call periodically)
   */
  cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.requests.entries()) {
      if (timestamps.length === 0) {
        this.requests.delete(key);
      }
    }
  }
}

module.exports = new RateLimiter();
```

---

## 🚀 How to Use These Examples

1. **Copy `server-advanced.js`** as your main server file
2. **Create middleware folder** and add middleware/index.js
3. **Create auth folder** for authentication
4. **Create utils folder** for utilities
5. **Create logger folder** for logging

Example structure:

```
project/
├── server-advanced.js
├── middleware/
│   └── index.js
├── auth/
│   ├── auth.js
│   └── routes.js
├── utils/
│   ├── queryBuilder.js
│   └── rateLimiter.js
├── logger/
│   └── logger.js
└── logs/
    └── app.log
```

Start your server:

```bash
node server-advanced.js
```

Test endpoints:

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get movies
curl http://localhost:3000/api/movies?sort=rating-desc&limit=5

# Create movie (requires auth)
curl -X POST http://localhost:3000/api/movies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Movie","director":"Director","genre":["Action"],"releaseYear":2023,"imdbRating":8.5}'
```

Happy Coding! 🎉
