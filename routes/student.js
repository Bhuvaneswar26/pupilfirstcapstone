const express = require("express");
const route = express.Router();
const { getstudent } = require("../controllers/student");

route.get("/", getstudent);

module.exports = route;
