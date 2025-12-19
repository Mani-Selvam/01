const router = require('express').Router();
let func = require('../config/index');
const userController = require('../controller/user_controller');

var verifyToken = require('../middleware/verifyToken');

router.get(func.url.GET_USERS,verifyToken, userController.getAllUser);
router.get(func.url.GET_USERS_Id,verifyToken, userController.getUserById);
router.post(func.url.CREATE_USERS,verifyToken, userController.createUser);
router.post(func.url.UPDATE_USERS,verifyToken, userController.updateUser);
router.get(func.url.DELETE_USERS,verifyToken, userController.deleteUser);

router.post(func.url.UPDATE_VERSION, userController.updateappversion);
router.get(func.url.GET_VERSION, userController.getcurrentversion);

module.exports = router;