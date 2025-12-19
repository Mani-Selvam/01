const router = require('express').Router();
let func = require('../config/index');
const leadSourceController = require('../controller/lead_source_controller');
var verifyToken = require('../middleware/verifyToken');
router.get(func.url.GET_LEAD_SOURCE,verifyToken, leadSourceController.getAllLeadSource);
router.get(func.url.GET_LEAD_SOURCE_Id,verifyToken, leadSourceController.getLeadSourceById);
router.post(func.url.CREATE_LEAD_SOURCE,verifyToken, leadSourceController.createLeadSource);
router.patch(func.url.UPDATE_LEAD_SOURCE,verifyToken, leadSourceController.updateLeadSource);
router.delete(func.url.DELETE_LEAD_SOURCE,verifyToken, leadSourceController.deleteLeadSource);

module.exports = router;