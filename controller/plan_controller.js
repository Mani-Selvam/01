
const planMasterService = require('../services/plan_service');

 const getAllPlan = async (req, res) => {
    try {
        const opData = await planMasterService.getAllPlan(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getPlanById = async (req, res) => {
    try {
        const opData = await planMasterService.getPlanById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createPlan = async (req, res) => {
    try {
        const opData = await planMasterService.createPlan(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updatePlan = async (req, res) => {
    try {
        const opData = await planMasterService.updatePlan(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deletePlan = async (req, res) => {
    console.log("eeeeeeccc",req);
    try {
        const opData = await planMasterService.deletePlan(req.query)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllPlan,getPlanById ,createPlan,updatePlan ,deletePlan};