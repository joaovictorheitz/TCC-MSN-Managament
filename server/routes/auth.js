var express = require("express");
var router = express.Router();
const db = require("../db");
const { createHash } = require("crypto");
const dotenv = require("dotenv");

dotenv.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

//https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
function generateAccessToken(email) {
  return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: "86400s" });
}

router.post("/signup", async (req, res) => {
  await db.connect();
  const users = db.db("sabor_nordeste").collection("users");

  const token = generateAccessToken({ email: req.body.email });
  res.json(token);
});

router.post("/signin", async function (req, res) {
  const formData = req.body;
  await db.connect();
  const users = db.db("sabor_nordeste").collection("users");
  let user = await users.findOne({ email: formData.email });

  let password = createHash("sha256").update(formData.password).digest("hex");

  let userAuth = {
    userExists: false,
    passwordMatches: false,
  };

  if (user != undefined) {
    userAuth.userExists = true;
    if (user.password == password) {
      userAuth.passwordMatches = true;
    }
  }

  res.send(userAuth);
});

module.exports = router;
