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
  };
  return Post;
};