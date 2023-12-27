const express = require("express");
const route = express.Router();
const {
  geteducator,
  getcreatecourse,
  postcreatecourse,
} = require("../controllers/educator");

route.get("/", geteducator);
route.get("/createcourse", getcreatecourse);
route.post("/createcourse", postcreatecourse);

module.exports = route;
