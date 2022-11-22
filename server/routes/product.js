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
  ],
};

router.get("/:id", function (req, res) {
  let product = products["products"].filter((product) => {
    return product.id == req.params.id;
  })[0];

  if (product == undefined) {
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
