var express = require("express");
var router = express.Router();
const db = require("../db.js");

const fs = require("fs");
const { ObjectID } = require("bson");

async function productSelect(id) {
  if (!ObjectID.isValid(id)) {
    return undefined;
  }

  await db.connect();
  const stock = db.db("sabor_nordeste").collection("products");
  const product = await stock.findOne({ _id: ObjectID(id) }).catch((err) => {
    return "ixi";
  });

  return product;
}

router.get("/:id", async function (req, res) {
  let product = await productSelect(req.params.id);

  if (product == undefined) {
    res.status(404);
    res.render("error", {
      error: {
        title: "404 🥴",
        description: `Produto "<span class="bold">${req.params.id}</span>" não foi encontrado no banco de dados.`,
      },
    });
  } else {
    res.render("product", { product: product });
  }
});

module.exports = router;
