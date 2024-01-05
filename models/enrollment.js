"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class enrollment extends Model {
    static associate(models) {
      enrollment.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      enrollment.belongsTo(models.Course, {
        foreignKey: "courseId",
        onDelete: "CASCADE",
      });
    }
  }
  enrollment.init(
    {
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "enrollment",
    },
  );
  return enrollment;
};
