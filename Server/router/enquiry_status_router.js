const router = require('express').Router();
let func = require('../config/index');
const enquiryStatusController = require('../controller/enquiry_status_controller');
var verifyToken = require('../middleware/verifyToken');
router.get(func.url.GET_ENQUIRY_STATUS,verifyToken, enquiryStatusController.getAllEnquiryStatus);
router.get(func.url.GET_ENQUIRY_STATUS_Id,verifyToken, enquiryStatusController.getEnquiryStatusById);
router.post(func.url.CREATE_ENQUIRY_STATUS,verifyToken, enquiryStatusController.createEnquiryStatus);
router.patch(func.url.UPDATE_ENQUIRY_STATUS,verifyToken, enquiryStatusController.updateEnquiryStatus);
router.delete(func.url.DELETE_ENQUIRY_STATUS,verifyToken, enquiryStatusController.deleteEnquiryStatus);

module.exports = router;