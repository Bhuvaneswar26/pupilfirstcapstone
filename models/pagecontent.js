"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pagecontent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

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
