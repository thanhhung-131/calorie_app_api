'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'weight', {
      type: Sequelize.FLOAT,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'height', {
      type: Sequelize.FLOAT,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'weight');
    await queryInterface.removeColumn('Users', 'height');
  }
};
