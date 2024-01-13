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
    queryInterface.addColumn("coursestatuses", "pageId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Pages",
        key: "id",
      },
    });

    // Adding foreign key constraint
    queryInterface.addConstraint("coursestatuses", {
      fields: ["pageId"],
      type: "foreign key",
      name: "coursestatuses_pageId_fk",
      references: {
        table: "Pages",
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
    // Removing foreign key constraint
    queryInterface.removeConstraint(
      "coursestatuses",
      "coursestatuses_pageId_fk",
    );
    queryInterface.removeColumn("coursestatuses", "pageId");
  },
};
