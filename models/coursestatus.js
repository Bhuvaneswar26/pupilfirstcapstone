"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class coursestatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
