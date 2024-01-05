const express = require("express");
const route = express.Router();
const {
  getstudent,
  enrollcourse,
  previewcourse,
} = require("../controllers/student");

route.get("/", getstudent);
route.get("/enroll/:courseid", enrollcourse);
route.get("/coursepreview/:courseid", previewcourse);

module.exports = route;
