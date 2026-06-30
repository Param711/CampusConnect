import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelize;

// Configure DB connection (uses memory-only SQLite during test runs to avoid schema pollution)
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else if (process.env.PGHOST || process.env.DATABASE_URL) {
  console.log('Database Config: Connecting to PostgreSQL...');
  
  if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      }
    });
  } else {
    sequelize = new Sequelize(
      process.env.PGDATABASE || 'campus',
      process.env.PGUSER || 'postgres',
      process.env.PGPASSWORD || 'postgres',
      {
        host: process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PGPORT, 10) || 5432,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
          ssl: process.env.DB_SSL === 'true' ? {
            require: true,
            rejectUnauthorized: false
          } : false
        }
      }
    );
  }
} else {
  console.log('Database Config: PostgreSQL environment variables not found. Using local SQLite (campus.db)...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './campus.db',
    logging: false
  });
}

export default sequelize;
