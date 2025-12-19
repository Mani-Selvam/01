
const ticketMasterService = require('../services/ticket_service');

 const getAllTicket = async (req, res) => {
    try {
        const opData = await ticketMasterService.getAllTicket(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getTicketById = async (req, res) => {
    try {
        const opData = await ticketMasterService.getTicketById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createTicket = async (req, res) => {
    try {
        const opData = await ticketMasterService.createTicket(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateTicket = async (req, res) => {
    try {
        const opData = await ticketMasterService.updateTicket(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteTicket = async (req, res) => {
    console.log("eeeeeeccc",req);
    try {
        const opData = await ticketMasterService.deleteTicket(req.query)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllTicket,getTicketById ,createTicket,updateTicket ,deleteTicket};