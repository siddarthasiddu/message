'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    user_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    post_id: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })
  };
  return Comment;
};