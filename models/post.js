'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    user_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    privacy: DataTypes.INTEGER,
    title: DataTypes.STRING,
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
  })
  };
  return Post;
};