const router = require('express').Router();
let func = require('../config/index');
const ticketController = require('../controller/ticket_controller');
var verifyToken = require('../middleware/verifyToken');
router.get(func.url.GET_TICKET,verifyToken, ticketController.getAllTicket);
router.get(func.url.GET_TICKET_Id,verifyToken, ticketController.getTicketById);
router.post(func.url.CREATE_TICKET,verifyToken, ticketController.createTicket);
router.post(func.url.UPDATE_TICKET,verifyToken, ticketController.updateTicket);
router.get(func.url.DELETE_TICKET,verifyToken, ticketController.deleteTicket);

module.exports = router;