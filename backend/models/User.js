import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'User name cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email address must be unique'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      notEmpty: {
        msg: 'Email address is required'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['student', 'admin']],
        msg: "Role must be either 'student' or 'admin'"
      }
    }
  }
}, {
  timestamps: true,
  updatedAt: false // we only need createdAt in spec
});

export default User;
