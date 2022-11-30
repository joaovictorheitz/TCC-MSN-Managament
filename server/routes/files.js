var express = require("express");
var router = express.Router();

router.get("/:path/:id", async function (req, res) {
  let params = req.params;
  res.sendFile(process.cwd() + `/files/${params.path}/${params.id}`);
});

module.exports = router;
