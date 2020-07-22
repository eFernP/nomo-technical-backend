const metric = require("../controllers/metric.controller.js");
var router = require("express").Router();

router.post("/create", metric.createMetric);
router.get("/all", metric.getMetrics);
router.get("/all/:average", metric.getMetrics);
router.put("/update", metric.updateMetric);
router.delete("/delete", metric.deleteMetric);

module.exports = router;
