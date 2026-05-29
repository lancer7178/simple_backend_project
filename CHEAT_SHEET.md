# ⚡ Advanced Concepts Cheat Sheet

Quick reference guide for advanced backend development patterns and solutions.

---

## 📋 Quick Navigation

- [Error Handling Patterns](#error-handling-patterns)
- [Middleware Patterns](#middleware-patterns)
- [Authentication Patterns](#authentication-patterns)
- [Async Patterns](#async-patterns)
- [Query Patterns](#query-patterns)
- [Status Codes Reference](#status-codes-reference)
- [Common Utilities](#common-utilities)

---

## 🛡️ Error Handling Patterns

### Pattern 1: Try-Catch with Status Codes

```javascript
app.get("/api/items/:id", (req, res, next) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) throw new Error("Invalid ID");

    const item = findItem(id);
    if (!item) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ data: item });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.message,
    });
  }
});
```

### Pattern 2: Input Validation

```javascript
function validate(data) {
  const errors = [];
  if (!data.name) errors.push("Name required");
  if (!data.email) errors.push("Email required");
  return { valid: errors.length === 0, errors };
}

app.post("/api/users", (req, res) => {
  const { valid, errors } = validate(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }
  // Create user...
});
```

### Pattern 3: Custom Error Class

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

throw new AppError("User not found", 404);
throw new AppError("Invalid input", 400);
```

---

## 🔧 Middleware Patterns

### Pattern 1: Request-Response Logging

```javascript
const logger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
};

app.use(logger);
```

### Pattern 2: Authentication Check

```javascript
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  if (verifyToken(token)) {
    next();
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.use("/api/protected", auth);
```

### Pattern 3: Role Authorization

```javascript
const authorize = (roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

app.delete("/api/items/:id", auth, authorize(["admin"]), (req, res) => {
  // Only admins can delete
});
```

### Pattern 4: CORS with Whitelist

```javascript
const cors = require("cors");
const whitelist = ["http://localhost:3000", "https://example.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
```

### Pattern 5: Global Error Handler

```javascript
// Place after all routes
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message,
      status: status,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
});
```

---

## 🔐 Authentication Patterns

### Pattern 1: JWT Token Generation

```javascript
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};
```

### Pattern 2: JWT Token Verification

```javascript
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

### Pattern 3: Protected Route Middleware

```javascript
const protected = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ error: "Invalid token" });

  req.user = decoded;
  next();
};
```

### Pattern 4: Login Endpoint

```javascript
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Check password
  if (user.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });

  // Generate token
  const token = generateToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
});
```

---

## ⏳ Async Patterns

### Pattern 1: Async Route Handler

```javascript
app.get("/api/items", async (req, res, next) => {
  try {
    const items = await getItemsFromDatabase();
    res.json({ data: items });
  } catch (error) {
    next(error);
  }
});
```

### Pattern 2: Parallel Requests

```javascript
app.get("/api/combined", async (req, res, next) => {
  try {
    const [users, posts, comments] = await Promise.all([
      getUsers(),
      getPosts(),
      getComments(),
    ]);

    res.json({ users, posts, comments });
  } catch (error) {
    next(error);
  }
});
```

### Pattern 3: Promise Error Handling

```javascript
Promise.all([promise1, promise2, promise3])
  .then(([result1, result2, result3]) => {
    res.json({ result1, result2, result3 });
  })
  .catch((error) => {
    res.status(500).json({ error: error.message });
  });
```

### Pattern 4: Sequential Operations

```javascript
async function processRequest() {
  const user = await getUser(id);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);
  return { user, posts, comments };
}
```

---

## 🔍 Query Patterns

### Pattern 1: Filtering

```javascript
const filtered = items.filter((item) => {
  if (req.query.status && item.status !== req.query.status) return false;
  if (req.query.category && item.category !== req.query.category) return false;
  return true;
});
```

### Pattern 2: Sorting

```javascript
const sorted = items.sort((a, b) => {
  if (req.query.sort === "name") return a.name.localeCompare(b.name);
  if (req.query.sort === "-name") return b.name.localeCompare(a.name);
  if (req.query.sort === "date") return a.date - b.date;
  return 0;
});
```

### Pattern 3: Pagination

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const paginated = items.slice(skip, skip + limit);
const total = items.length;

res.json({
  data: paginated,
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});
```

### Pattern 4: Combined Query

```javascript
app.get("/api/items", (req, res) => {
  let items = [...database];

  // Filter
  if (req.query.category) {
    items = items.filter((i) => i.category === req.query.category);
  }

  // Sort
  if (req.query.sort === "price") {
    items.sort((a, b) => a.price - b.price);
  }

  // Paginate
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const result = items.slice(skip, skip + limit);

  res.json({
    data: result,
    total: items.length,
    page,
    pages: Math.ceil(items.length / limit),
  });
});
```

### Pattern 5: Search

```javascript
app.get("/api/search", (req, res) => {
  const term = req.query.q?.toLowerCase() || "";

  const results = items.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(term)),
  );

  res.json({ data: results, count: results.length });
});
```

---

## 📊 Status Codes Reference

| Code                 | Name                  | Use Case                        |
| -------------------- | --------------------- | ------------------------------- |
| **2xx Success**      |
| 200                  | OK                    | Request successful              |
| 201                  | Created               | Resource created                |
| 204                  | No Content            | Success, no body                |
| **3xx Redirection**  |
| 301                  | Moved Permanently     | Resource moved                  |
| 302                  | Found                 | Temporary redirect              |
| 304                  | Not Modified          | Cached response valid           |
| **4xx Client Error** |
| 400                  | Bad Request           | Invalid data                    |
| 401                  | Unauthorized          | Authentication required         |
| 403                  | Forbidden             | Authenticated but no permission |
| 404                  | Not Found             | Resource not found              |
| 409                  | Conflict              | Duplicate resource              |
| 422                  | Unprocessable Entity  | Validation failed               |
| 429                  | Too Many Requests     | Rate limit exceeded             |
| **5xx Server Error** |
| 500                  | Internal Server Error | Server error                    |
| 502                  | Bad Gateway           | Upstream error                  |
| 503                  | Service Unavailable   | Server down                     |

---

## 🛠️ Common Utilities

### Utility 1: Date Formatting

```javascript
const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

console.log(formatDate(new Date())); // 2024-01-15
```

### Utility 2: Generate Random ID

```javascript
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
```

### Utility 3: Validate Email

```javascript
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### Utility 4: Deep Clone Object

```javascript
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
```

### Utility 5: Merge Objects

```javascript
const merge = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};
```

### Utility 6: Remove Duplicates

```javascript
const unique = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

// Usage: unique(users, 'id')
```

### Utility 7: Group By

```javascript
const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    (result[item[key]] = result[item[key]] || []).push(item);
    return result;
  }, {});
};

// Usage: groupBy(users, 'role')
```

### Utility 8: Flatten Array

```javascript
const flatten = (arr) => {
  return arr.reduce(
    (flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item),
    [],
  );
};
```

### Utility 9: Sleep/Delay

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function example() {
  console.log("Starting...");
  await sleep(2000);
  console.log("After 2 seconds");
}
```

### Utility 10: Retry Logic

```javascript
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * Math.pow(2, i));
    }
  }
}

// Usage
await retryWithBackoff(() => apiCall(), 3, 1000);
```

---

## 🎯 Response Format Best Practices

### Consistent Success Response

```javascript
res.json({
  success: true,
  message: "Items retrieved successfully",
  data: items,
  metadata: {
    timestamp: new Date(),
    count: items.length,
  },
});
```

### Consistent Error Response

```javascript
res.status(400).json({
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input",
    details: ["Email is required", "Password must be 8+ characters"],
  },
});
```

---

## 📝 Common Code Snippets

### Snippet 1: Check Required Fields

```javascript
const requiredFields = ["name", "email", "password"];
const missing = requiredFields.filter((field) => !req.body[field]);

if (missing.length > 0) {
  return res.status(400).json({
    error: `Missing required fields: ${missing.join(", ")}`,
  });
}
```

### Snippet 2: Sanitize Output

```javascript
const sanitize = (user) => {
  const { password, ...safe } = user;
  return safe;
};

res.json({ user: sanitize(user) });
```

### Snippet 3: Rate Limiting Check

```javascript
const checkRateLimit = (ip, maxRequests = 100, windowMs = 60000) => {
  if (!requests[ip]) requests[ip] = [];
  const now = Date.now();
  requests[ip] = requests[ip].filter((t) => now - t < windowMs);

  if (requests[ip].length >= maxRequests) {
    return false;
  }

  requests[ip].push(now);
  return true;
};
```

### Snippet 4: Pagination Calculation

```javascript
const getPagination = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
  };
};
```

---

## 🚀 Pro Tips

1. **Always validate input** - Never trust client data
2. **Use status codes correctly** - Helps debugging
3. **Log important events** - Easier troubleshooting
4. **Handle errors gracefully** - Better UX
5. **Paginate large datasets** - Reduces memory usage
6. **Cache when possible** - Improves performance
7. **Use environment variables** - Never hardcode secrets
8. **Test edge cases** - Find bugs early
9. **Document your API** - Helps other developers
10. **Monitor in production** - Catch issues quickly

---

## 📚 Learn More

- [Express.js Docs](https://expressjs.com/)
- [Node.js API Docs](https://nodejs.org/api/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Explained](https://jwt.io/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

Happy Coding! 🎉
