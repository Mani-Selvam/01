
const leadSouceService = require('../services/lead_source_service');

 const getAllLeadSource = async (req, res) => {
    try {
        const opData = await leadSouceService.getAllLeadSource(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getLeadSourceById = async (req, res) => {
    try {
        const opData = await leadSouceService.getLeadSourceById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createLeadSource = async (req, res) => {
    try {

        console.log("opData")
        const opData = await leadSouceService.createLeadSource(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateLeadSource = async (req, res) => {
    try {
        console.log("req",req.query.id)
        
        const opData = await leadSouceService.updateLeadSource(req.query.id,req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteLeadSource = async (req, res) => {
    try {

        console.log("req",req)

        const opData = await leadSouceService.deleteLeadSource(req.query.id)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllLeadSource,getLeadSourceById ,createLeadSource,updateLeadSource ,deleteLeadSource};