import sequelize from '../config/database.js';
import User from './User.js';
import Notice from './Notice.js';
import Event from './Event.js';

// Setup relationships
User.hasMany(Notice, {
  foreignKey: 'postedBy',
  onDelete: 'CASCADE'
});

Notice.belongsTo(User, {
  foreignKey: 'postedBy',
  as: 'author'
});

export {
  sequelize,
  User,
  Notice,
  Event
};
