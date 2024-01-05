"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: "facultyId",
        onDelete: "CASCADE",
      });

      Course.hasMany(models.Chapter, {
        foreignKey: "courseId",
        onDelete: "CASCADE",
      });

      Course.hasMany(models.enrollment, {
        foreignKey: "courseId",
        onDelete: "CASCADE",
      });
    }
  }
  Course.init(
    {
      courseName: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
    },
  );
  return Course;
};
