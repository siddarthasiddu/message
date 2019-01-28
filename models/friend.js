'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    friend_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    channel_hash: DataTypes.STRING
  }, {});
  Friend.associate = function(models) {
    // associations can be defined here
    Friend.belongsTo(models.User,{
      as: 'myfriend',
      foreignKey: 'friend_id'
    });
  };
  return Friend;
};