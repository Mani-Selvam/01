
const followUpMasterService = require('../services/followup_service');

 const getAllFollowUp = async (req, res) => {
    try {
        const opData = await followUpMasterService.getAllFollowUp(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getFollowUpById = async (req, res) => {
    try {
        const opData = await followUpMasterService.getFollowUpById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const getFollowUpHistory = async (req, res) => {
    try {
        const opData = await followUpMasterService.getFollowUpHistory(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createFollowUp = async (req, res) => {
    try {
        const opData = await followUpMasterService.createFollowUp(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateFollowUp = async (req, res) => {
    try {
        const opData = await followUpMasterService.updateFollowUp(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteFollowUp = async (req, res) => {
    try {
        const opData = await followUpMasterService.deleteFollowUp(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getAllFollowUpByDay = async (req, res) => {
    try {
        const opData = await followUpMasterService.getAllFollowUpByDay(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getAllFollowUpByDayFilter = async (req, res) => {
    try {
        const opData = await followUpMasterService.getAllFollowUpByDayFilter(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getAllmissedfollowups = async (req, res) => {
    try {
        const opData = await followUpMasterService.getAllmissedfollowups(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = { getAllFollowUpByDayFilter, getAllFollowUp,getFollowUpById,getFollowUpHistory ,createFollowUp,updateFollowUp ,deleteFollowUp,getAllFollowUpByDay,getAllmissedfollowups};