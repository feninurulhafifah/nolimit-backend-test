const sequelize = require('../config/database');
const User = require('./user');
const Post = require('./post');


User.hasMany(Post, { foreignKey: 'authorId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  User,
  Post,
};