"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pagecontent extends Model {
    static associate(models) {
      Pagecontent.belongsTo(models.Page, {
        foreignKey: "pageId",
      });
    }
  }
  Pagecontent.init(
    {
      sectionNumber: DataTypes.INTEGER,
      type: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Pagecontent",
    },
  );
  return Pagecontent;
};
