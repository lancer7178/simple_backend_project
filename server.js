const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database (Marvel movies)
let movies = [
  {
    id: 1,
    title: "Iron Man",
    releaseYear: 2008,
    director: "Jon Favreau",
    genre: ["Action", "Adventure", "Sci-Fi"],
    boxOffice: "585.4 million",
    imdbRating: 7.9,
    mainActor: "Robert Downey Jr.",
    plotSummary:
      "After being held captive, Tony Stark builds a powered suit to fight against evil.",
  },
  {
    id: 2,
    title: "The Avengers",
    releaseYear: 2012,
    director: "Joss Whedon",
    genre: ["Action", "Adventure"],
    boxOffice: "1.52 billion",
    imdbRating: 8.0,
    mainActor: "Robert Downey Jr.",
    plotSummary:
      "Earth's mightiest heroes must come together to fight an alien invasion.",
  },
  {
    id: 3,
    title: "Avengers: Endgame",
    releaseYear: 2019,
    director: "Anthony & Joe Russo",
    genre: ["Action", "Adventure", "Drama"],
    boxOffice: "2.798 billion",
    imdbRating: 8.4,
    mainActor: "Robert Downey Jr.",
    plotSummary:
      "The Avengers assemble once more to undo Thanos' actions and restore balance.",
  },
];

// ============================
// GET Methods
// ============================

// GET - Get all movies
app.get("/api/movies", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Retrieved all movies",
    data: movies,
    count: movies.length,
  });
});

// GET - Get a specific movie by ID
app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === parseInt(id));

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: `Movie with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Movie retrieved successfully",
    data: movie,
  });
});

// ============================
// POST Method
// ============================

// POST - Create a new movie
app.post("/api/movies", (req, res) => {
  const {
    title,
    releaseYear,
    director,
    genre,
    boxOffice,
    imdbRating,
    mainActor,
    plotSummary,
  } = req.body;

  // Validation
  if (!title || !releaseYear || !director) {
    return res.status(400).json({
      success: false,
      message: "Title, release year, and director are required",
    });
  }

  // Create new movie
  const newMovie = {
    id: movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1,
    title,
    releaseYear,
    director,
    genre: genre || [],
    boxOffice: boxOffice || "N/A",
    imdbRating: imdbRating || 0,
    mainActor: mainActor || "N/A",
    plotSummary: plotSummary || "N/A",
    createdAt: new Date().toISOString(),
  };

  movies.push(newMovie);

  res.status(201).json({
    success: true,
    message: "Movie created successfully",
    data: newMovie,
  });
});

// ============================
// PUT Method
// ============================

// PUT - Update an entire movie (complete replacement)
app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    releaseYear,
    director,
    genre,
    boxOffice,
    imdbRating,
    mainActor,
    plotSummary,
  } = req.body;

  // Validation
  if (!title || !releaseYear || !director) {
    return res.status(400).json({
      success: false,
      message: "Title, release year, and director are required",
    });
  }

  const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));

  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Movie with ID ${id} not found`,
    });
  }

  // Replace entire movie
  movies[movieIndex] = {
    ...movies[movieIndex],
    title,
    releaseYear,
    director,
    genre: genre || movies[movieIndex].genre,
    boxOffice: boxOffice || movies[movieIndex].boxOffice,
    imdbRating: imdbRating || movies[movieIndex].imdbRating,
    mainActor: mainActor || movies[movieIndex].mainActor,
    plotSummary: plotSummary || movies[movieIndex].plotSummary,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    data: movies[movieIndex],
  });
});

// ============================
// PATCH Method
// ============================

// PATCH - Partial update of a movie
app.patch("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));

  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Movie with ID ${id} not found`,
    });
  }

  // Partially update movie (only update provided fields)
  movies[movieIndex] = {
    ...movies[movieIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: "Movie partially updated successfully",
    data: movies[movieIndex],
  });
});

// ============================
// DELETE Method
// ============================

// DELETE - Delete a movie by ID
app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === parseInt(id));

  if (movieIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Movie with ID ${id} not found`,
    });
  }

  const deletedMovie = movies.splice(movieIndex, 1);

  res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
    data: deletedMovie[0],
  });
});

// ============================
// Health Check
// ============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Marvel Movies API",
    version: "1.0.0",
    endpoints: {
      "GET /api/movies": "Get all movies",
      "GET /api/movies/:id": "Get movie by ID",
      "POST /api/movies": "Create new movie",
      "PUT /api/movies/:id": "Update entire movie",
      "PATCH /api/movies/:id": "Partially update movie",
      "DELETE /api/movies/:id": "Delete movie",
    },
  });
});

// ============================
// Error Handling
// ============================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ============================
// Start Server
// ============================

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /api/items       - Get all items`);
  console.log(`  GET    /api/items/:id   - Get specific item`);
  console.log(`  POST   /api/items       - Create new item`);
  console.log(`  PUT    /api/items/:id   - Update entire item`);
  console.log(`  PATCH  /api/items/:id   - Partially update item`);
  console.log(`  DELETE /api/items/:id   - Delete item`);
});
