import express from 'express';
import { Op } from 'sequelize';
import { Notice, User, sequelize } from '../models/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /notices - List notices with optional filters (category, keyword, postedBy) and limit/offset pagination
router.get('/', async (req, res) => {
  const { category, keyword, postedBy, limit, offset } = req.query;
  const whereClause = {};

  if (category) {
    whereClause.category = category;
  }
  
  if (postedBy) {
    whereClause.postedBy = postedBy;
  }

  if (keyword) {
    const likeOp = sequelize.options.dialect === 'postgres' ? Op.iLike : Op.like;
    whereClause[Op.or] = [
      { title: { [likeOp]: `%${keyword}%` } },
      { content: { [likeOp]: `%${keyword}%` } }
    ];
  }

  const parsedLimit = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);

  const queryLimit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
  const queryOffset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  try {
    const { count, rows } = await Notice.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role', 'createdAt']
        }
      ],
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
    console.error('Error fetching notices:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /notices - Create a new notice (requires admin role)
router.post('/', writeLimiter, authenticateToken, requireRole('admin'), async (req, res) => {
  const { title, content, category, postedBy } = req.body;

  // Validate presence of required fields
  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!content) missingFields.push('content');
  if (!category) missingFields.push('category');
  if (!postedBy) missingFields.push('postedBy');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  try {
    // Verify that the user exists in the database
    const author = await User.findByPk(postedBy);
    if (!author) {
      return res.status(400).json({
        error: `Invalid postedBy value: User with ID '${postedBy}' does not exist`
      });
    }

    const notice = await Notice.create({ title, content, category, postedBy });
    
    // Fetch newly created notice with author info for the response
    const noticeWithAuthor = await Notice.findByPk(notice.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'role', 'createdAt']
        }
      ]
    });

    return res.status(201).json(noticeWithAuthor);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join('. ')
      });
    }
    
    console.error('Error creating notice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
