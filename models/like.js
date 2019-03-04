'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    parent_id: DataTypes.INTEGER //post_id
  }, {});
  Like.associate = function(models) {
    // associations can be defined here
    Like.belongsTo(models.Post, {
      foreignKey: 'parent_id',
      as: 'post'
  })
  };
  return Like;
};