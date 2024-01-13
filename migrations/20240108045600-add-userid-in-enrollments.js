/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn("coursestatuses", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });

    queryInterface.addConstraint("coursestatuses", {
      fields: ["userId"],
      type: "foreign key",
      name: "coursestatuses_userId_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeConstraint(
      "coursestatuses",
      "coursestatuses_userId_fk",
    );
  },
};
