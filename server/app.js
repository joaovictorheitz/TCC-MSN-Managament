const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const finances = require("./routes/finances");
const product = require("./routes/product");
const admin = require("./routes/admin");
const files = require("./routes/files");
const stock = require("./routes/stock");
const sells = require("./routes/sells");
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

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", auth);

app.use("/finances", finances);
app.use("/product", product);
app.use("/stock", stock);
app.use("/sells", sells);
app.use("/files", files);
app.use("/admin", admin);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
