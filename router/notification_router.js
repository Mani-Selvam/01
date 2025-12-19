const router = require('express').Router();
let func = require('../config/index');
const notificationController = require('../controller/notification_controller');

var verifyToken = require('../middleware/verifyToken');

router.get(func.url.GET_NOTIFICATION,verifyToken, notificationController.getAllNotification);
router.post(func.url.CREATE_NOTIFICATION,verifyToken, notificationController.createNotification);
router.post(func.url.UPDATE_NOTIFICATION,verifyToken, notificationController.updateNotification);
router.post(func.url.DELETE_NOTIFICATION,verifyToken, notificationController.deleteNotification);

module.exports = router;