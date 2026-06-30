import express from 'express';
import { Op } from 'sequelize';
import { Event, sequelize } from '../models/index.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// GET /events - List events with optional filters (category, from, to, keyword) and limit/offset pagination
router.get('/', async (req, res) => {
  const { category, from, to, keyword, limit, offset } = req.query;
  const whereClause = {};

  if (category) {
    whereClause.category = category;
  }

  // Date range filters
  if (from || to) {
    whereClause.startTime = {};
    if (from) {
      const fromDate = new Date(from);
      if (!isNaN(fromDate.getTime())) {
        whereClause.startTime[Op.gte] = fromDate;
      } else {
        return res.status(400).json({ error: "Invalid date format for 'from' query parameter" });
      }
    }
    if (to) {
      const toDate = new Date(to);
      if (!isNaN(toDate.getTime())) {
        whereClause.startTime[Op.lte] = toDate;
      } else {
        return res.status(400).json({ error: "Invalid date format for 'to' query parameter" });
      }
    }
  }

  if (keyword) {
    const likeOp = sequelize.options.dialect === 'postgres' ? Op.iLike : Op.like;
    whereClause[Op.or] = [
      { title: { [likeOp]: `%${keyword}%` } },
      { description: { [likeOp]: `%${keyword}%` } },
      { venue: { [likeOp]: `%${keyword}%` } }
    ];
  }

  const parsedLimit = parseInt(limit, 10);
  const parsedOffset = parseInt(offset, 10);

  const queryLimit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 100) : 10;
  const queryOffset = !isNaN(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

  try {
    const { count, rows } = await Event.findAndCountAll({
      where: whereClause,
      limit: queryLimit,
      offset: queryOffset,
      order: [['startTime', 'ASC']]
    });
    return res.json({
      count,
      limit: queryLimit,
      offset: queryOffset,
      results: rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /events - Create a new event (requires admin role)
router.post('/', writeLimiter, authenticateToken, requireRole('admin'), async (req, res) => {
  const { title, description, category, venue, startTime, endTime, organizer } = req.body;

  // Validate presence of required fields
  const missingFields = [];
  if (!title) missingFields.push('title');
  if (!description) missingFields.push('description');
  if (!category) missingFields.push('category');
  if (!venue) missingFields.push('venue');
  if (!startTime) missingFields.push('startTime');
  if (!endTime) missingFields.push('endTime');
  if (!organizer) missingFields.push('organizer');

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  // Validate date formatting
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime())) {
    return res.status(400).json({ error: "Invalid date format for 'startTime'" });
  }
  if (isNaN(end.getTime())) {
    return res.status(400).json({ error: "Invalid date format for 'endTime'" });
  }

  // Validate date range constraints
  if (start.getTime() >= end.getTime()) {
    return res.status(400).json({
      error: "Invalid date range: Event 'startTime' must come before its 'endTime'"
    });
  }

  try {
    const event = await Event.create({
      title,
      description,
      category,
      venue,
      startTime: start,
      endTime: end,
      organizer
    });
    return res.status(201).json(event);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join('. ')
      });
    }
    
    console.error('Error creating event:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
