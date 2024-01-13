const express = require("express");
const route = express.Router();
const {
  getstudent,
  enrollcourse,
  previewcourse,
  getenrolledcourse,
  getchapter,
  getpagecontent,
  markascompleted,
} = require("../controllers/student");

route.get("/", getstudent);
route.get("/enroll/:courseid", enrollcourse);
route.get("/coursepreview/:courseid", previewcourse);
route.get("/enrolledcourse/:courseid", getenrolledcourse);
route.get("/chapter/:chapterid", getchapter);
route.get("/chapterpages/:chapterid/:pageid/:status", getpagecontent);
route.get("/markascomplete/:pageid", markascompleted);

module.exports = route;
