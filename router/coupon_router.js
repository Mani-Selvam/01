const router = require('express').Router();
let func = require('../config/index');
const couponController = require('../controller/coupon_controller');
var verifyToken = require('../middleware/verifyToken');
router.get(func.url.GET_COUPON,verifyToken, couponController.getAllCoupon);
router.get(func.url.GET_COUPON_Id,verifyToken, couponController.getCouponById);
router.post(func.url.CREATE_COUPON,verifyToken, couponController.createCoupon);
router.post(func.url.UPDATE_COUPON,verifyToken, couponController.updateCoupon);
router.get(func.url.DELETE_COUPON,verifyToken, couponController.deleteCoupon);

router.post(func.url.APPLY_COUPON,verifyToken, couponController.applyCoupon);
module.exports = router;