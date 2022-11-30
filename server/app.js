const express = require("express");
const fileUpload = require('express-fileupload')
const finances = require("./routes/finances");
const product = require("./routes/product");
const files = require("./routes/files");
const stock = require("./routes/stock");
const auth = require("./routes/auth");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  express.static("./public", {
    extensions: ["html", "htm"],
  })
);

app.use(fileUpload())

app.use(express.json());

app.use("/auth", auth);
app.use("/stock", stock);
app.use("/product", product);
app.use("/finances", finances);
app.use("/files", files);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
