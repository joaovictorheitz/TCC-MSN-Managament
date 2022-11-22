const MAX_QUERY_LIMIT = 21;

var express = require("express");
var router = express.Router();

function pad(num, size) {
  var s = "000000000000" + num;
  return s.substr(s.length - size);
}

const products = {
  products: [
    {
      id: 1,
      title: "Tomate Cereja",
      description: "",
      price: 19.47,
      profit: 110,
      stock: 94,
      format: "kg",
      category: "fruits",
      thumbnail:
        "https://us-southeast-1.linodeobjects.com/storage/fluminense/media/uploads/produto/tomate_cereja_kg_05d99f87-ab61-425a-9d88-41dc750c5adb.png",
      purchases: [
        {
          purchase_id: pad(1, 12),
          purchase_date:
            "Compra <span class='medium'>" +
            new Date().toISOString().split("T")[0].replaceAll("-", "/") +
            "</span>",
          validity: "06-08-2022",
          quantity: 4.27,
          price: 20.9,
          method: "Cartão de Crédito",
          parcels: 1,
        },
      ],
    },
    {
      id: 2,
      title: "Alface Crespa",
      description: "",
      price: 4.99,
      profit: 110,
      stock: 9.34,
      format: "kg",
      category: "vegetables",
      thumbnail:
        "https://images.squarespace-cdn.com/content/v1/5b8edfa12714e508f756f481/1543944726778-3R28J0BST06GRZCOF7UR/alface-crespa-verde-hidropo%CC%82nica.png?format=256w",
      purchases: [
        {
          purchase_id: pad(1, 12),
          purchase_date:
            "Compra <span class='medium'>" +
            new Date().toISOString().split("T")[0].replaceAll("-", "/") +
            "</span>",
          validity: "06-08-2022",
          quantity: 4.27,
          price: 20.9,
          method: "Cartão de Crédito",
          parcels: 1,
        },
      ],
    },
    {
      id: 3,
      title: "Couve",
      description: "",
      price: 2.99,
      profit: 110,
      stock: 2.34,
      format: "kg",
      category: "vegetables",
      thumbnail:
        "https://static1.conquistesuavida.com.br/ingredients/9/54/52/09/@/24752--ingredient_detail_ingredient-2.png",
      purchases: [
        {
          purchase_id: pad(1, 12),
          purchase_date:
            "Compra <span class='medium'>" +
            new Date().toISOString().split("T")[0].replaceAll("-", "/") +
            "</span>",
          validity: "06-08-2022",
          quantity: 4.27,
          price: 20.9,
          method: "Cartão de Crédito",
          parcels: 1,
        },
      ],
    },
  ],
};

router.get("/search", function (req, res) {
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

  products.products.forEach((product) => {
    if (
      product.title.toLowerCase().includes(query.toLowerCase()) &&
      l < limit
    ) {
      data.push({
        id: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        description: product.description,
        price: product.price,
        in_stock: product.stock,
      });
      l++;
    }
  });

  if (sort != undefined) {
    let key = sort.split("-")[0];
    let direction = sort.split("-")[1];
    console.log(
      data.sort((a, b) => {
        var x = a[key];
        var y = b[key];
        return x < y ? -1 : x > y ? 1 : 0;
      })
    );

    if (direction == "desc") {
      data.reverse();
    }
  }

  res.send(data);
});

module.exports = router;
