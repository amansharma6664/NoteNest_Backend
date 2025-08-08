// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Secret key used to verify JWT tokens, stored in environment variables for security
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware function to fetch the logged-in user from the JWT token
const fetchUser = (req, res, next) => {
  // Get token from the request header
  const token = req.header('auth-token');

  // If no token is found, deny access
  if (!token) return res.status(401).send({ error: "Access Denied" });

  try {
    // Verify the token using the secret key
    const data = jwt.verify(token, JWT_SECRET);

    // Attach the user data to the request object for use in the next middleware/route
    req.user = data.user;

    // Move to the next middleware or route handler
    next();
  } catch {
    // If token verification fails, return an error
    res.status(401).send({ error: "Invalid Token" });
  }
};

// Export the middleware function for use in routes
module.exports = fetchUser;
