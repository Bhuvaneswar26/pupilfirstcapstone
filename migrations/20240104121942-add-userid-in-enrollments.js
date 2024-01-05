/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("enrollments", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    });

    // Adding foreign key constraint
    queryInterface.addConstraint("enrollments", {
      fields: ["userId"],
      type: "foreign key",
      name: "enrollments_userId_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("enrollments", "enrollments_userId_fk");
  },
};
