const router = require('express').Router();
let func = require('../config/index');
const aboutContentController = require('../controller/aboutContent_controller');
var verifyToken = require('../middleware/verifyToken');

router.get(func.url.GET_CONTENT,verifyToken, aboutContentController.getAllAboutContent);
router.post(func.url.CREATE_CONTENT,verifyToken, aboutContentController.createAboutContent);
router.post(func.url.UPDATE_CONTENT,verifyToken, aboutContentController.updateAboutContent);

module.exports = router;