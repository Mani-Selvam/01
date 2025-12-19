const express = require("express");
const bodyParser = require("body-parser");
const config = require("../config/config.js");
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();

// Use bodyParser.urlencoded() with the extended option
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json({ limit: "50mb" }));
router.use(cors());

router.get("/", (req, res) => {
  res.json({ status: "ok", message: "Enquiry Management API is running" });
});

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", require("../router/auth_router.js"));
router.use("/mail", require("../router/auth_router.js"));
router.use("/enquiry", require("../router/enquiry_router.js"));
router.use("/user", require("../router/user_router.js"));
router.use("/version", require("../router/user_router.js"));
router.use("/plan", require("../router/plan_router.js"));
router.use("/followup", require("../router/follow-up_router.js"));
router.use("/notification", require("../router/notification_router.js"));
router.use('/profileimages', express.static('./uploads/profileimages'));
router.use('/enquiryimages', express.static('./uploads/enquiryimages'));

router.use('/ticketimages', express.static('./uploads/ticketimages'));
router.use("/razorpay",  require("../router/payment_router.js"));
router.use("/order",  require("../router/payment_router.js"));
router.use("/coupon",  require("../router/coupon_router.js"));
router.use("/aboutcontent",  require("../router/aboutcontent_router.js"));
router.use("/ticket",  require("../router/ticket_router.js"));
const paymentRouter = require("../router/payment_router.js");

router.use("/api", bodyParser.urlencoded({ extended: true }), paymentRouter);
router.use("/transaction", bodyParser.urlencoded({ extended: true }), paymentRouter);
router.use("/leadsource", require("../router/lead_source_router.js"));
router.use("/enquirystatus", require("../router/enquiry_status_router.js"));

// router.use("/follow-up", require('../router/follow-up.js'));

module.exports = (req, res, next) => {
  router(req, res, next);
};