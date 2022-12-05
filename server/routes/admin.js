const { ObjectID } = require("bson");
var express = require("express");
var router = express.Router();
const db = require("../db");

router.get("/", async function (req, res) {
  res.render("admin");
});

router.get("/workers", async function (req, res) {
  await db.connect();
  const users = db.db("sabor_nordeste").collection("users");
  const workers = await users.find({}).toArray();

  res.render("workers", { workers: workers });
});

router.post(`/workers/:id`, async (req, res) => {
  await db.connect();
  const users = db.db("sabor_nordeste").collection("users");
  let permission = req.body;
  let permissions = await users.findOne({ _id: ObjectID(req.params.id) });
  permissions.permissions[Object.keys(permission)[0]] =
    permission[Object.keys(permission)[0]];
  let newPermissions = permissions.permissions;

  console.log(newPermissions);

  await users.updateOne(
    { _id: ObjectID(req.params.id) },
    {
      $set: {
        permissions: newPermissions,
      },
    }
  );
});

module.exports = router;
