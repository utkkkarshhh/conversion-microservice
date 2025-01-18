const express = require("express");
const path = require("path");
const env = require("./utils/dotenvConfig");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger/swagger");
const conversionRouter = require("./routers/conversionRouter/conversionRouter");
const {sequelize, models} = require("docuvault-database")

// Middlewares
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "views/public")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Connect to Sequelize
sequelize.authenticate().then(() => {
  console.log('Conversion Service connected to database');
}).catch(console.error);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Get on home route
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api", conversionRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `App is live on port http://localhost:${PORT} | Environment : ${process.env.NODE_ENV}`
  );
});
