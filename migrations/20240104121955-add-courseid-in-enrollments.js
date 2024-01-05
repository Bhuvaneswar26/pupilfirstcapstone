/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("enrollments", "courseId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Courses",
        key: "id",
      },
    });

    // Adding foreign key constraint
    queryInterface.addConstraint("enrollments", {
      fields: ["courseId"],
      type: "foreign key",
      name: "enrollments_courseId_fk",
      references: {
        table: "Courses",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint("enrollments", "enrollments_courseId_fk");
  },
};
