var express = require("express");
var router = express.Router();

let date = new Date();
let today = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;

const dummyData = {
  newClients: [
    {
      date: today,
      new_clients: 8,
    },
    {
      date:
        today.slice(0, today.length - 1) +
        (parseInt(today.charAt(today.length - 1)) - 1),
      new_clients: 44,
    },
  ],
  sells: [
    {
      date: today,
      sells: 224,
      sells_return: 284.7,
    },
    {
      date:
        today.slice(0, today.length - 1) +
        (parseInt(today.charAt(today.length - 1)) - 1),
      sells: 231,
      sells_return: 571.83,
    },
  ],
  mostSold: [
    {
      date: today,
      highlights: [
        { id: 1 },
        { id: 2 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
      ],
    },
    {
      date:
        today.slice(0, today.length - 1) +
        (parseInt(today.charAt(today.length - 1)) - 1),
      highlights: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    },
  ],
};

router.get("/", function (req, res) {
  res.render("finances", { data: dummyData });

  // console.log(dummyData.newClients[0].new_clients - dummyData.newClients[1].new_clients);
});

module.exports = router;
