const jwt = require("jsonwebtoken"); // Import JSON Web Token for verifying user identity
require("dotenv").config(); // Load environment variables (e.g., JWT_SECRET) from .env

// Define authMiddleware function which optionally accepts allowed roles
const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      // Extract token from Authorization header (e.g., "Bearer <token>")
      const token = req.header("Authorization")?.replace("Bearer ", "");

      // If no token is found, deny access
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token, Authorization denied."
        });
      }

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // If token is valid
      if (decoded) {
        req.user = decoded; // Attach decoded user info (like id, role) to req object
        // console.log("decoded",decoded);
        // If roles are provided and user role is not allowed, deny access
        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return res.status(403).json({
            success: false,
            message: "Access Denied."
          });
        }
        
        next(); // Proceed to next middleware or route handler
      }
    } catch (error) {
      // Handle invalid token or other errors
      res.status(500).json({
        success: false,
        message: "Internal Server Error [NOT AUTHORIZED]",
      });
    }
  };
};

module.exports = authMiddleware; // Export middleware for use in protected routes
