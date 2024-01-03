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
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    queryInterface.removeColumn("Chapters", "courseId");
  },
};
