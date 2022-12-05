var express = require("express");
var router = express.Router();
const db = require("../db");

const fs = require("fs");

let dummyData;

fs.readFile("./data/stock.json", "utf8", (err, data) => {
  if (err) throw err;
  dummyData = JSON.parse(data);
});

router.get("/", async (req, res) => {
  await db.connect();
  const finances = db.db("sabor_nordeste").collection("finances");
  const sells = db.db("sabor_nordeste").collection("sells");
  let a = await finances.find({}).toArray();
  a.forEach((b) => {
    console.log(b.data);
  });

  res.render("finances", { data: dummyData });
});

module.exports = router;
