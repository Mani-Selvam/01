const router = require('express').Router();
let func = require('../config/index');
const followUpController = require('../controller/followup_controller');

var verifyToken = require('../middleware/verifyToken');

router.get(func.url.GET_FOLLOW_UP,verifyToken, followUpController.getAllFollowUp);
router.get(func.url.GET_FOLLOW_UP_Id,verifyToken, followUpController.getFollowUpById);
router.get(func.url.GET_FOLLOW_UP_HISTORY,verifyToken, followUpController.getFollowUpHistory);
router.post(func.url.CREATE_FOLLOW_UP,verifyToken, followUpController.createFollowUp);
router.post(func.url.UPDATE_FOLLOW_UP,verifyToken, followUpController.updateFollowUp);
router.post(func.url.DELETE_FOLLOW_UP,verifyToken, followUpController.deleteFollowUp);

router.get(func.url.GET_FOLLOW_UP_BY_DATE,verifyToken, followUpController.getAllFollowUpByDay);
router.get(func.url.GET_FOLLOW_UP_BY_DATE_FILTER,verifyToken, followUpController.getAllFollowUpByDayFilter);

router.get(func.url.GET_MISSED_FOLLOWUP,verifyToken, followUpController.getAllmissedfollowups);
module.exports = router;