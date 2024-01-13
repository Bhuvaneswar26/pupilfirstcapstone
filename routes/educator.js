const express = require("express");
const route = express.Router();
const {
  geteducator,
  getcreatecourse,
  postcreatecourse,
  geteditcourse,
  getaddchapter,
  postaddchapter,
  geteditchapter,
  patcheditchapter,
  postaddpage,
  getaddcontent,
  postaddcontent,
  puteditcontent,
  getreports,
  getcoursereports,
} = require("../controllers/educator");

route.get("/", geteducator);
route.get("/createcourse", getcreatecourse);
route.post("/createcourse", postcreatecourse);
route.get("/editcourse", geteditcourse);
route.get("/addchapter/:courseid", getaddchapter);
route.post("/addchapter/:courseid", postaddchapter);
route.get("/editchapter/:chapterid", geteditchapter);
route.put("/editchapter/:chapterid", patcheditchapter);
route.post("/addpage/:chapterid", postaddpage);
route.get("/addcontent/:pageid", getaddcontent);
route.post("/addcontent/:pageid/:noofinputs", postaddcontent);
route.put("/editcontent/:pageid/:sectionid", puteditcontent);
route.get("/reports", getreports);
route.get("/reports/:courseid", getcoursereports);

module.exports = route;
