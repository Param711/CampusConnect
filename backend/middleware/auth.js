import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'campus-hub-secret';

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing. Please provide it in Authorization Bearer header' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired access token. Please log in again' });
    }
    req.user = user;
    next();
  });
};

// Middleware to enforce role-based access control (RBAC)
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ error: 'Access unauthorized: missing user authentication context' });
    }

    const allowed = Array.isArray(allowedRoles) 
      ? allowedRoles.includes(req.user.role)
      : req.user.role === allowedRoles;

    if (!allowed) {
      return res.status(403).json({ 
        error: `Access denied: role '${req.user.role}' is not authorized. Requires administrative privileges` 
      });
    }
    
    next();
  };
};
export default authenticateToken;
