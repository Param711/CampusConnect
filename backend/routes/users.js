import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /users - List all users (requires JWT) with limit/offset pagination
router.get('/', authenticateToken, async (req, res) => {
  let { limit, offset } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);

  const queryLimit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
  const queryOffset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  try {
    const { count, rows } = await User.findAndCountAll({
      limit: queryLimit,
      offset: queryOffset,
      order: [['createdAt', 'DESC']]
    });
    return res.json({
      count,
      limit: queryLimit,
      offset: queryOffset,
      results: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /users - Create a new user
router.post('/', authLimiter, async (req, res) => {
  const { name, email, role } = req.body;

  // Manual basic payload checks for missing fields to satisfy "All required fields must be present"
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!email) missingFields.push('email');
  if (!role) missingFields.push('role');

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: `Missing required fields: ${missingFields.join(', ')}` 
    });
  }

  try {
    const user = await User.create({ name, email, role });
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.status(201).json({ token, user });
  } catch (error) {
    // Check for Sequelize validation / constraint errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: error.errors.map(e => e.message).join('. ') 
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: `Email address '${email}' is already registered by another user` 
      });
    }
    
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /users/login - Authenticate user by email and return JWT
router.post('/login', authLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: `Authentication failed: User with email '${email}' is not registered` });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ token, user });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
