import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
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
        msg: 'Event title cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event description cannot be empty'
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event category is required'
      }
    }
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event venue is required'
      }
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Event startTime must be a valid date'
      },
      notEmpty: {
        msg: 'Event startTime is required'
      }
    }
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Event endTime must be a valid date'
      },
      notEmpty: {
        msg: 'Event endTime is required'
      }
    }
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Event organizer is required'
      }
    }
  }
}, {
  timestamps: true,
  updatedAt: false,
  validate: {
    startTimeBeforeEndTime() {
      if (this.startTime && this.endTime) {
        const start = new Date(this.startTime);
        const end = new Date(this.endTime);
        if (start.getTime() >= end.getTime()) {
          throw new Error('Event startTime must come before its endTime');
        }
      }
    }
  }
});

export default Event;
