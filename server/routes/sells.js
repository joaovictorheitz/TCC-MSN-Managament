var express = require("express");
var router = express.Router();
const db = require("../db.js");

const { ObjectID } = require("bson");

router.get("/", async function (req, res) {
  res.render("sells");
});

router.get("/search", async function (req, res) {
  await db.connect();
  const stock = db.db("sabor_nordeste").collection("products");

  const query = req.query.q.toString().replaceAll(" ", "").toLowerCase();
  const pattern = `.*${query}.*`;
  let regex = new RegExp(pattern);
  let response = [];

  await stock
    .find({ searchTitle: regex })
    .limit(20)
    .toArray()
    .then((products) => {
      products.forEach((product) => {
        response.push({
          _id: product._id,
          title: product.title,
          price: product.price,
          format: product.format,
          thumbnail: product.thumbnail,
        });
      });
    });

  res.send(response);
});

router.post("/sell", async (req, res) => {
  await db.connect();
  const sells = db.db("sabor_nordeste").collection("sells");

  req.body.parcels = parseInt(req.body.parcels);

  sells.insertOne(req.body);
  res.sendStatus(200);
});

router.get("/history", async (req, res) => {
  await db.connect();
  const sells = db.db("sabor_nordeste").collection("sells");
  let history = await sells.find({}).limit(20).toArray();
  history.forEach((sell) => {
    switch (sell.payment_method) {
      case "credit_card":
        sell.payment_method = "Cartão de Crédito";
        break;
      case "debit_card":
        sell.payment_method = "Cartão de Débito";
        break;
      case "pix":
        sell.payment_method = "PIX";
        break;
      case "money":
        sell.payment_method = "Dinheiro";
        break;
      case "prize":
        sell.payment_method = "Prazo";
        break;

      default:
        break;
    }
  });

  res.render("history", { sells: history });
});

module.exports = router;
