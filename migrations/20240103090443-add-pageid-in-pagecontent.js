/* eslint-disable no-unused-vars */
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Pagecontents", "pageId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Pages",
        key: "id",
      },
    });

    // Adding foreign key constraint
    await queryInterface.addConstraint("Pagecontents", {
      fields: ["pageId"],
      type: "foreign key",
      name: "pageId_fk",
      references: {
        table: "Pages",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Pagecontents", "pageId_fk");
  },
};
