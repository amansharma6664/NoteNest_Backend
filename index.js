// Import required modules
const express = require('express');
const connectToMongo = require('./db'); // Function to connect to MongoDB
const dotenv = require('dotenv');       // Loads environment variables from .env file
const cors = require('cors');           // Enables Cross-Origin Resource Sharing

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectToMongo();

// Initialize the Express application
const app = express();

// Enable CORS to allow cross-origin requests (e.g., from frontend running on a different port)
app.use(cors());

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Define API routes
app.use('/api/auth', require('./routes/auth'));   // Route for authentication (login/signup)
app.use('/api/notes', require('./routes/notes')); // Route for note-related CRUD operations

// Start the server on port 5000
app.listen(5000, () => console.log("Server running on port 5000"));
