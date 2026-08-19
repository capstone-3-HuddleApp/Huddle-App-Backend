'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add columns to existing Events table
    await queryInterface.addColumn('events', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });
    await queryInterface.addColumn('events', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove columns (undo the migration)
    await queryInterface.removeColumn('events', 'latitude');
    await queryInterface.removeColumn('events', 'longitude');
  }
};