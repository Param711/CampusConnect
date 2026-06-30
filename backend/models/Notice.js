import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Notice title cannot be empty'
      }
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Notice content cannot be empty'
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Notice category is required'
      }
    }
  },
  postedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      isUUID: {
        args: 4,
        msg: 'postedBy must be a valid UUID corresponding to a User'
      },
      notEmpty: {
        msg: 'postedBy field is required'
      }
    }
  }
}, {
  timestamps: true,
  updatedAt: false
});

export default Notice;
