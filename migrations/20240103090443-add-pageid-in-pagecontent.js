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

    await queryInterface.addColumn("Pagecontents", "pageId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Pages",
        key: "id",
      },
    });

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

  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint("Pagecontents", "pageId_fk");
  },
};
