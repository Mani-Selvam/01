
const enquiryMasterService = require('../services/enquiry_service');

 const getAllEnquiry = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getAllEnquiry(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getEnquiryById = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getEnquiryById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createEnquiry = async (req, res) => {
    try {
        const opData = await enquiryMasterService.createEnquiry(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateEnquiry = async (req, res) => {
    try {
        const opData = await enquiryMasterService.updateEnquiry(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteEnquiry = async (req, res) => {
    try {
        const opData = await enquiryMasterService.deleteEnquiry(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const getEnquiryCount = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getEnquiryCount(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getEnquiryCountByMonth = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getEnquiryCountByMonth(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}


const getAllEnquiryByMonth = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getAllEnquiryByMonth(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getAllEnquiryByDay = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getAllEnquiryByDay(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const getAllSalesByMonth = async (req, res) => {
    try {

        const opData = await enquiryMasterService.getAllSalesByMonth(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getAllSalesAmountByMonth = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getAllSalesAmountByMonth(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const getAllDroppedByMonth = async (req, res) => {
    try {
        const opData = await enquiryMasterService.getAllDroppedByMonth(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllEnquiry,getEnquiryById ,createEnquiry,updateEnquiry ,deleteEnquiry,getAllSalesByMonth,
     getEnquiryCount,getAllEnquiryByMonth,getAllEnquiryByDay,getAllDroppedByMonth,getAllSalesAmountByMonth,getEnquiryCountByMonth};