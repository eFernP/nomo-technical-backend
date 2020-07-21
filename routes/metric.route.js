const metric = require("../controllers/metric.controller.js");
var router = require("express").Router();

// ruta=> api/users/...

router.post("/create", metric.createMetric);
router.get("/all", metric.getMetrics);
router.get("/all/:average", metric.getMetrics);

module.exports = router;
