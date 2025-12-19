
const enquiryStatusService = require('../services/enquiry_status_service');

 const getAllEnquiryStatus = async (req, res) => {
    try {
        const opData = await enquiryStatusService.getAllEnquiryStatus(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getEnquiryStatusById = async (req, res) => {
    try {
        const opData = await enquiryStatusService.getEnquiryStatusById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createEnquiryStatus = async (req, res) => {
    try {

        console.log("opData")
        const opData = await enquiryStatusService.createEnquiryStatus(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateEnquiryStatus = async (req, res) => {
    try {
        console.log("req",req.query.id)
        
        const opData = await enquiryStatusService.updateEnquiryStatus(req.query.id,req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteEnquiryStatus = async (req, res) => {
    try {

        console.log("req",req)

        const opData = await enquiryStatusService.deleteEnquiryStatus(req.query.id)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllEnquiryStatus,getEnquiryStatusById ,createEnquiryStatus,updateEnquiryStatus ,deleteEnquiryStatus};