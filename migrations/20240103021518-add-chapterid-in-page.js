/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("Pages", "chapterId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Chapters",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    queryInterface.addConstraint("Pages", {
      fields: ["chapterId"],
      type: "foreign key",
      references: {
        table: "Chapters",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Pages", "chapterId");
  },
};
