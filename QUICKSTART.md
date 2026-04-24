# ⚡ Quick Start Guide

Get your Node.js backend running in 3 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This installs:

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **nodemon** - Auto-reload on code changes (dev only)

## Step 2: Start the Server

```bash
npm start
```

**Output:**

```
✅ Server is running on http://localhost:3000
📚 API Documentation available at http://localhost:3000
```

## Step 3: Test the API

### Option A: Using curl (Terminal)

**Get all items:**

```bash
curl http://localhost:3000/api/items
```

**Create new item:**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"title":"My Item","description":"Item description"}'
```

### Option B: Using REST Client (VS Code)

1. Install "REST Client" extension in VS Code
2. Open the `test.rest` file in this project
3. Click "Send Request" above each request

### Option C: Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint:
   - GET http://localhost:3000/api/items
   - POST http://localhost:3000/api/items (with JSON body)
   - etc.

---

## 📝 All Endpoints at a Glance

```
GET    http://localhost:3000/api/items          - Get all items
GET    http://localhost:3000/api/items/:id      - Get item by ID
POST   http://localhost:3000/api/items          - Create item
PUT    http://localhost:3000/api/items/:id      - Update entire item
PATCH  http://localhost:3000/api/items/:id      - Partially update item
DELETE http://localhost:3000/api/items/:id      - Delete item
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Change port in server.js
const PORT = 3001; // Change to any available port
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Server Won't Start

- Check if Node.js is installed: `node --version`
- Check if port 3000 is available
- Look for error messages in console

---

## 💻 Project Files Explained

| File                | Purpose                              |
| ------------------- | ------------------------------------ |
| `server.js`         | Main server file with all API routes |
| `package.json`      | Project configuration & dependencies |
| `test.rest`         | API endpoint tests (for REST Client) |
| `README.md`         | Full documentation                   |
| `LEARNING_GUIDE.md` | Detailed concepts explanation        |

---

## 🎯 What to Try Next

1. **Test all HTTP methods**: Use curl or Postman to test GET, POST, PUT, PATCH, DELETE
2. **Modify the data**: Change items in the array and see what happens
3. **Add new fields**: Add `priority`, `category`, etc. to items
4. **Add validation**: Prevent invalid data from being saved
5. **Connect database**: Replace array with MongoDB or SQLite

---

## 🆘 Need Help?

- Read `README.md` for detailed API documentation
- Read `LEARNING_GUIDE.md` for concept explanations
- Check `server.js` code comments for implementation details
- Visit [Express.js docs](https://expressjs.com/)

---

**Ready to learn? Start the server and explore!** 🚀
