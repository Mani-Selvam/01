
const notificationMasterService = require('../services/notification_service');

 const getAllNotification = async (req, res) => {
    try {
        const opData = await notificationMasterService.getAllNotification(req)
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}


const createNotification = async (req, res) => {
    try {
        const opData = await notificationMasterService.createNotification(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateNotification = async (req, res) => {
    try {
        const opData = await notificationMasterService.updateNotification(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteNotification = async (req, res) => {
    try {
        const opData = await notificationMasterService.deleteNotification(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllNotification,createNotification,updateNotification ,deleteNotification};