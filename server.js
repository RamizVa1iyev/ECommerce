// decaration of use internal modules
const fs = require("fs");

// importing foreign modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const passport = require("passport");
const passportJson = require("passport-json");
const expressWs = require("express-ws");
const fileUpload = require("express-fileupload");

// importing own modules
const auth = require("./auth");
const websocket = require("./websocket");
const product = require("./product");
const cart = require("./cart");

let config = {};
try {
  config = JSON.parse(fs.readFileSync("config.json"));
} catch (err) {
  console.error(err.message);
  process.exit(0);
}

const app = express();

app.use(morgan("tiny"));
app.use(cors());

app.use(bodyParser.json());
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

// authorization middleware
app.use(
  expressSession({
    secret: config.dbUrl,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportJson.Strategy(auth.checkCredentials));
passport.serializeUser(auth.serialize);
passport.deserializeUser(auth.deserialize);

// file upload
app.use(fileUpload());
app.post("/files", auth.checkIfInRole([0, 1]), (req, res) => {
  let { image } = req.files;
  if (!image || !/^image/.test(image.mimetype)) {
    res.sendStatus(400);
    return;
  }
  image.mv("./frontend/dist/uploads/" + req.user.username + ".jpg");
  res.sendStatus(200);
});
app.delete("/files", (req, res) => {
  res.sendStatus(200);
});

app.use(express.static(config.frontend));

// authentication endpoints
app.get("/auth", auth.whoami);
app.post(
  "/auth",
  passport.authenticate("json", { failWithError: true }),
  auth.login,
  auth.errorHandler
);
app.delete("/auth", auth.logout);

app.get("/product", product.get);
app.post("/product", auth.checkIfInRole([0]), product.post);
app.put("/product", auth.checkIfInRole([0]), product.put);
app.delete("/product", auth.checkIfInRole([0]), product.delete);

app.get("/cart", cart.get);
app.post("/cart", auth.checkIfInRole([0, 1]), cart.post);
app.put("/cart", auth.checkIfInRole([0, 1]), cart.put);
app.delete("/cart", auth.checkIfInRole([0, 1]), cart.delete);

// websockets handling
const wsInstance = expressWs(app);
app.ws("/websocket", websocket(wsInstance));

mongoose
  .connect(config.dbUrl)
  .then((connection) => {
    console.log("Database connected");
    // initialize models over the connection
    product.init(connection);
    cart.init(connection);

    app.listen(config.port, () => {
      console.log("Backend listening on port", config.port);
    });
  })
  .catch((err) => console.error(err.message));
