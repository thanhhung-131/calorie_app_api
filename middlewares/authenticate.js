// middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError, ForbiddenError } = require('../services/errorService');

const authenticate = (requiredRole) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, 'secret_key'); // Replace 'secret_key' with your secret key
      console.log(decoded)
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      // admin
      if (requiredRole && user.role !== requiredRole) {
        throw new ForbiddenError('You do not have permission to access this resource');
      }

      req.user = user; // Add user to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.log(error)
      if (error instanceof ForbiddenError) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = authenticate;
