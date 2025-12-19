const router = require('express').Router();
let func = require('../config/index');
const authController = require('../controller/auth_controller');


router.post(func.url.AUTH_REGISTER, authController.authRegister);
router.post(func.url.AUTH_LOGIN, authController.authLogin);
router.post(func.url.CHANGE_PASSWORD, authController.changePassword);
router.post(func.url.LOGOUT, authController.logout);

router.post(func.url.SEND_OTP, authController.sendOTPEmail);
router.post(func.url.VERIFY_OTP, authController.verifyOTP);
router.post(func.url.FORGOTPASSWORD_OTP, authController.forgotpasswordOTPEmail);

module.exports = router;