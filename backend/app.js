import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';

// Import Routers
import usersRouter from './routes/users.js';
import noticesRouter from './routes/notices.js';
import eventsRouter from './routes/events.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Mount API routes directly to match the endpoint specification exactly
app.use('/users', usersRouter);
app.use('/notices', noticesRouter);
app.use('/events', eventsRouter);

// Mount API routes with /api prefix for Vercel Serverless Function compatibility
app.use('/api/users', usersRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/events', eventsRouter);

// Global Error Handler (handles malformed JSON payloads and server bugs)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON request body' });
  }
  
  console.error('Unhandled server error:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

// Root route welcome/healthcheck
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Campus Hub REST API!',
    databaseDialect: sequelize.options.dialect,
    status: 'healthy'
  });
});

// Sync Database with connection retries (handles startup delays in Docker containers)
const syncWithRetries = async (retries = 5, delay = 3000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Database synchronized successfully.');
      return;
    } catch (err) {
      console.error(`Database connection failed. Retries left: ${retries - 1}. Error:`, err.message);
      retries -= 1;
      if (retries === 0) {
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  syncWithRetries()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT}/ in your browser.`);
      });
    })
    .catch((err) => {
      console.error('Failed to sync database after multiple retries:', err);
      process.exit(1);
    });
}

export default app;
