module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Posts',
        'title',
         Sequelize.STRING
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes

    return Promise.all([
      queryInterface.removeColumn(
        'Posts',
        'title'
      )
    ]);
  }
};