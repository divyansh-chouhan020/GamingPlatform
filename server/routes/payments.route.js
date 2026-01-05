const express = require("express");
const router = express.Router();

const { createOrder, verifyPayment } = require("../controller/payment.controller");

const { protectRoute } = require("../middleware/auth");

router.post("/createOrder", protectRoute, createOrder);
router.post("/verifyPayment", protectRoute, verifyPayment);

module.exports = router;