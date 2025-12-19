

const router = require('express').Router();
let func = require('../config/index');
var paymentController = require("../controller/payment_controller");

var verifyToken = require('../middleware/verifyToken');

router.post(func.url.CREATE_ORDER,verifyToken, paymentController.OrderCreation);
router.post(func.url.CREATE_DIRECT_ORDER,verifyToken, paymentController.directOrderCreation);
router.post(func.url.DEACTIVATE_ORDER,verifyToken, paymentController.directOrderInActive);

router.get(func.url.GET_ORDER_ID,verifyToken, paymentController.getOrderById);
router.post(func.url.VERIFY_RAZORPAY, paymentController.verifyRazorpayTransaction);
router.post(func.url.SUCCESS,verifyToken, paymentController.razorpaySucess);
router.post(func.url.FAILURE,verifyToken, paymentController.razorpayFailure);


module.exports = router;

// var express = require("express");
// var paymentController = require("../controller/payment_controller");
// var paymentRouter = express.Router();
// const router = require('express').Router();
// // Create an endpoint to generate a Razorpay order
// paymentRouter.post('/create-order',  paymentController.OrderCreation);

// router.post('/verifyPayment', paymentController.verifyRazorpayTransaction);
// // paymentRouter.post('/verifyPayment', paymentController.verifyRazorpayTransaction);

// paymentRouter.post(
//   "/request/phone",
//   paymentController.handlePaymentControllerPhone
// );
// paymentRouter.post(
//   "/response",
//   paymentController.handleResponsePaymentController
// );
// paymentRouter.get('/', paymentController.handleTransaction);


// module.exports = paymentRouter;