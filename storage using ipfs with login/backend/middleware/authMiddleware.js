
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('Authorization');

  // Check if no token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  console.log(token);
  try {
    // Verify the token using the JWT secret

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    
    // Attach the user from the token to the request object
    req.user = decoded; // Optionally, you can store user ID or other details
    next(); // Call next to pass control to the next middleware function
  } catch (error) {
    // Token is not valid
    console.log(token);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
