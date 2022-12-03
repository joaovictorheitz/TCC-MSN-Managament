const MAX_QUERY_LIMIT = 21;
const db = require("../db");
var express = require("express");
const { ObjectID } = require("bson");
var router = express.Router();

router.get("/add", (req, res) => {
  res.render("add-product");
});

router.post("/add", async (req, res) => {
  let image = null;
  if (req.files) image = req.files.image;

  let data = req.body;
  let id;

  const stock = db.db("sabor_nordeste").collection("products");
  await stock.insertOne(
    {
      title: data.title,
      format: data.format,
      price: parseFloat(parseFloat(data.price).toFixed(2)),
      category: data.category,
      purchases: [],
      in_stock: 0,
      profit: 100,
    },
    async (err, result) => {
      if (err) return res.sendStatus(500);

      id = await result.insertedId.toString();

      await stock.updateOne(
        { _id: ObjectID(id) },
        {
          $set: {
            thumbnail:
              image == null
                ? `/assets/placeholder.png`
                : `/files/products/${id}.${
                    image.name.split(".")[image.name.split(".").length - 1]
                  }`,
          },
        }
      );

      if (image != null) {
        image.mv(
          process.cwd() +
            `/files/products/${id}.${
              image.name.split(".")[image.name.split(".").length - 1]
            }`
        );
      }

      res.status(200);
      res.redirect(`/product/${id}`);
    }
  );
});

router.get("/search", async function (req, res) {
  await db.connect();
  const stock = db.db("sabor_nordeste").collection("products");
  const products = await stock.find({}).toArray();

  let query = req.query.q;
  let limit = req.query.limit;
  let sort = req.query.sort;

  if (query == undefined) {
    res.send({
      error: "Query cannot be empty",
    });
    return;
  }

  if (parseInt(limit) > MAX_QUERY_LIMIT) {
    res.send({
      error: `"limit" parameter exceded max (${MAX_QUERY_LIMIT})`,
    });
    return;
  }

  let l = 0;
  let data = [];

  products.forEach((product) => {
    if (
      product.title.toLowerCase().includes(query.toLowerCase()) &&
      l < limit
    ) {
      data.push(product);
      l++;
    }
  });

  if (sort != undefined) {
    let key = sort.split("-")[0];
    let direction = sort.split("-")[1];
    data.sort((a, b) => {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });

    if (direction == "desc") {
      data.reverse();
    }
  }

  res.send(data);
});

router.post("/:id/update", async (req, res) => {
  const stock = db.db("sabor_nordeste").collection("products");

  let data = req.body;
  data.price = parseFloat(data.price);
  data.profit = parseFloat(data.profit);

  await stock.updateOne(
    { _id: ObjectID(req.params.id) },
    {
      $set: req.body,
    },
    (err, success) => {
      if (err) return res.sendStatus(500);
      res.sendStatus(200);
    }
  );
});

router.post("/:id/newBuy", async (req, res) => {
  const stock = db.db("sabor_nordeste").collection("products");
  let data = req.body;

  data.value = parseFloat(data.value);
  data.quantity = parseFloat(data.quantity);
  data.parcels = parseInt(data.parcels);

  await stock.updateOne(
    { _id: ObjectID(req.params.id) },
    {
      $inc: { in_stock: data.quantity },
      $push: {
        purchases: data,
      },
    },
    (err, success) => {
      if (err) return res.sendStatus(500);
      res.redirect(`/product/${req.params.id}`);
    }
  );
});

module.exports = router;
