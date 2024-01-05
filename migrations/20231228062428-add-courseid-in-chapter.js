/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("Chapters", "courseId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Courses",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    queryInterface.addConstraint("Chapters", {
      fields: ["courseId"],
      type: "foreign key",
      references: {
        table: "Courses",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn("Chapters", "courseId");
  },
};
