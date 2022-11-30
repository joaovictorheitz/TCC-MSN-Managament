var express = require("express");
var router = express.Router();

const fs = require("fs");

let dummyData;

fs.readFile("./data/stock.json", "utf8", (err, data) => {
  if (err) throw err;
  dummyData = JSON.parse(data);
});

router.get("/", function (req, res) {
  res.render("finances", { data: dummyData });
});

module.exports = router;
