"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    static associate(models) {
      // The association methods should be called directly on the model class
      Page.hasMany(models.coursestatus, {
        foreignKey: "pageId",
        onDelete: "CASCADE",
      });

      Page.hasMany(models.Pagecontent, {
        foreignKey: "pageId",
        onDelete: "CASCADE",
      });

      Page.belongsTo(models.Chapter, {
        foreignKey: "chapterId",
      });
    }
  }

  Page.init(
    {
      pageNumber: DataTypes.INTEGER,
      pageName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Page",
    },
  );

  return Page;
};
