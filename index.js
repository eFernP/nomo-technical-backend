const bodyParser = require("body-parser");
const express = require("express");

require("dotenv").config();

const { db } = require("./models");
const metricRoute = require("./routes/metric.route");

const app = express();

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync();

app.use("/api/metrics", metricRoute);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));
