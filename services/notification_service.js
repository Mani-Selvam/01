let func = require('../config/index');
const { ObjectId } = require('bson');
const notificationSchema = require('../models/notification_model');
const enquirySchema = require('../models/enquiry_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');

 const getAllNotification = async (req,res) => {

    try {
        let obj = {};
        if(req.query.userId){
            obj.userId = req.query.userId
          }
        let findnotification = await notificationSchema.find(obj);
        if (findnotification) {
            let returnObj = {};
            returnObj.totalCount = findnotification.length
            returnObj.notification = findnotification.reverse()
            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the notification");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
 
};


let createNotification = async (req, res) => {
    try {
        const latestNotification = await notificationSchema.findOne().sort({ notification_no: -1 }).limit(1);
        const nextNotificationNo = latestNotification
        ? Number(latestNotification.notification_no.replace('FU_', '')) + 1: 1;;

        const notificationNo = generateNotificationNo(nextNotificationNo);
        req.notification_no = notificationNo;
        let createNewNotification = new notificationSchema(req);
        createNewNotification = await createNewNotification.save();
        func.response.successJson['data'] = createNewNotification;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateNotification = async (req, res) => {
    try {
        let findnotification = await notificationSchema.findOne({ _id: req._id });
        if (findnotification) {
            _.each(Object.keys(req), (key) => {
                findnotification[key] = req[key];
            });
            const result = await findnotification.save();
            const updatednotification = await notificationSchema.findOne({ _id: req._id  });
            func.response.successJson['data'] = updatednotification;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the notification");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let deleteNotification = async (req, res) => {
    try {
        let findnotification = await notificationSchema.findByIdAndDelete(req._id);
        if (findnotification) {
            return res.status(200).json({ message: "Successfully deleted notification" });
        } else {
            return res.status(404).json({ error: "Notification not found" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

function generateNotificationNo(nextNotificationNo) {
    return `FU_${nextNotificationNo}`;
}

module.exports = {  getAllNotification,createNotification, updateNotification,deleteNotification };