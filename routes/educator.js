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

module.exports = route;
