var express = require("express");
var router = express.Router();
const db = require("../db");
const { ObjectID } = require("bson");

router.get("/:path/:id", async function (req, res) {
  let params = req.params;
  res.sendFile(process.cwd() + `/files/${params.path}/${params.id}`);
});

router.post("/:path/:id", async function (req, res) {
  let file = req.files.file;
  let path = req.params.path;
  let id = req.params.id;

  let relativePath = `/files/${path}/${id}.${
    file.name.split(".")[file.name.split(".").length - 1]
  }`;
  let fullPath = process.cwd() + relativePath;

  if (path == "products") {
    const stock = db.db("sabor_nordeste").collection("products");

    await stock.updateOne(
      { _id: ObjectID(id) },
      {
        $set: {
          thumbnail: relativePath,
        },
      }
    );
  }

  file.mv(fullPath);
});

module.exports = router;
