"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class coursestatus extends Model {
    static associate(models) {
      // define association here
      coursestatus.belongsTo(models.User, {
        foreignKey: "userId",
      });

      coursestatus.belongsTo(models.Page, {
        foreignKey: "pageId",
      });
    }
  }
  coursestatus.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "coursestatus",
    },
  );
  return coursestatus;
};
