"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
      Chapter.belongsTo(models.Course, {
        foreignKey: "courseId",
      });

      Chapter.hasMany(models.Page, {
        foreignKey: "chapterId",
        onDelete: "CASCADE",
      });
    }
  }
  Chapter.init(
    {
      chapterNumber: DataTypes.INTEGER,
      chapterName: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Chapter",
    },
  );
  return Chapter;
};
