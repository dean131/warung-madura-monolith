require("dotenv").config();
const config = require("./config");

const cors = require("cors");
const swaggerDocs = require("./swagger");
const bodyParser = require("body-parser");
const express = require("express");
const globalErrorHandler = require("./middleware/errorHandler");
const db = require("./config/database");

const app = express();
const port = config.port;
const host = config.host;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", "./views");

db.raw("SELECT 1")
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection failed:", err));

const routes = require("./routes");
routes(app, "/api");

swaggerDocs.swagger(app);

app.get("/", (req, res) => {
  res.render("welcome", {
    text: "Hello, Warung Madura API is running!",
  });
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server running on http://${host}:${port}`);
  console.log(`API Docs available at http://${host}:${port}/docs`);
});
