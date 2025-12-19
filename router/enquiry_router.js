const router = require('express').Router();
let func = require('../config/index');
const enquiryController = require('../controller/enquiry_controller');
const followUpController = require('../controller/followup_controller');

var verifyToken = require('../middleware/verifyToken');

router.get(func.url.GET_ENQUIRY,verifyToken, enquiryController.getAllEnquiry);
router.get(func.url.GET_ENQUIRY_Id,verifyToken, enquiryController.getEnquiryById);
router.post(func.url.CREATE_ENQUIRY,verifyToken, enquiryController.createEnquiry);
router.post(func.url.UPDATE_ENQUIRY,verifyToken, enquiryController.updateEnquiry);
router.post(func.url.DELETE_ENQUIRY,verifyToken, enquiryController.deleteEnquiry);
router.get(func.url.GET_ENQUIRY_HISTORY,verifyToken, followUpController.getFollowUpHistory);

router.get(func.url.GET_ENQUIRY_COUNT,verifyToken, enquiryController.getEnquiryCount); 
router.get(func.url.GET_ENQUIRY_COUNT_BY_MONTH,verifyToken, enquiryController.getEnquiryCountByMonth); 

router.get(func.url.GET_ENQUIRY_BY_MONTH,verifyToken, enquiryController.getAllEnquiryByMonth);
router.get(func.url.GET_ENQUIRY_BY_DAY,verifyToken, enquiryController.getAllEnquiryByDay);

router.get(func.url.GET_SALES_BY_MONTH,verifyToken, enquiryController.getAllSalesByMonth);
router.get(func.url.GET_SALESAMOUNT_BY_MONTH,verifyToken, enquiryController.getAllSalesAmountByMonth);
router.get(func.url.GET_DROP_BY_MONTH,verifyToken, enquiryController.getAllDroppedByMonth);


module.exports = router;