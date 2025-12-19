const router = require('express').Router();
let func = require('../config/index');
const planController = require('../controller/plan_controller');
var verifyToken = require('../middleware/verifyToken');
router.get(func.url.GET_PLAN,verifyToken, planController.getAllPlan);
router.get(func.url.GET_PLAN_Id,verifyToken, planController.getPlanById);
router.post(func.url.CREATE_PLAN,verifyToken, planController.createPlan);
router.post(func.url.UPDATE_PLAN,verifyToken, planController.updatePlan);
router.get(func.url.DELETE_PLAN,verifyToken, planController.deletePlan);

module.exports = router;