module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'gender',
         Sequelize.STRING
       ),
      queryInterface.addColumn(
        'Users',
        'age',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'status',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'firstname',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'lastname',
        Sequelize.STRING
      )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes

    return Promise.all([
      queryInterface.removeColumn(
        'Users',
        'gender'
      ),
      queryInterface.removeColumn(
        'Users',
        'age'
      ),
      queryInterface.removeColumn(
        'Users',
        'status'
      ),
      queryInterface.removeColumn(
        'Users',
        'firstname'
      ),
      queryInterface.removeColumn(
        'Users',
        'lastname'
      )
    ]);
  }
};