
const express = require("express");
const router = express.Router();
const urlCtrl = require("../Controllers/url_controller");

router.post("/shorten", urlCtrl.shorten);
router.get("/get-url/:code", urlCtrl.getUrl);
router.get("/Statistics/:id", urlCtrl.getAllStatistics);

module.exports = router;