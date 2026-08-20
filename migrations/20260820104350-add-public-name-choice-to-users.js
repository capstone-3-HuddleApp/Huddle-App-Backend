'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
    // Stores whether the user wants their display name or username shown publicly.
    await queryInterface.addColumn("users", "public_name_choice", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "displayName",
    });
  },

  async down(queryInterface) {
    // Removes the public-name preference if this migration is reversed.
    await queryInterface.removeColumn("users", "public_name_choice");
  },
};
