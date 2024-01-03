"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Page.belongsTo(models.Chapter, {
        foreignKey: "chapterId",
      });

      Page.hasMany(models.Pagecontent, {
        foreignKey: "pageId",
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
