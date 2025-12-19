let func = require('../config/index');
const { ObjectId } = require('bson');
const enquiryStatusSchema = require('../models/enquiry_status_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');

const getAllEnquiryStatus = async (req) => {
    try {
        let enquiryStatus = await enquiryStatusSchema.find({userId : req.query.userId,is_deleted: false});
        console.log("enquiryStatus",enquiryStatus)
        if (enquiryStatus) {
            func.response.successJson['data'] = enquiryStatus;
            console.log("enquiryStatus",enquiryStatus);
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the plans");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};

let getEnquiryStatusById = async (req, res) => {
    try {
        let enquiryStatus = await enquiryStatusSchema.findOne({ _id: req.query.id, is_deleted: false });
        if (enquiryStatus) {
            func.response.successJson['data'] = enquiryStatus;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createEnquiryStatus = async (req, res) => {
    try {

        let createEnquiryStatus = await enquiryStatusSchema.create(req.body);
        console.log("createEnquiryStatus",createEnquiryStatus);
        func.response.successJson['data'] = createEnquiryStatus;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateEnquiryStatus = async (id, body) => {
    try {
        // , is_deleted: false 
        let enquiryStatus = await enquiryStatusSchema.findOne({ _id: id});
        if (enquiryStatus) {
            Object.assign(enquiryStatus, body);
            await enquiryStatus.save();
            func.response.successJson['data'] = enquiryStatus;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.error(e);
        return jsend(406, e.message);
    }
}

let deleteEnquiryStatus = async (id) => {
    try {
        let enquiryStatus = await enquiryStatusSchema.findOne({ _id: id });
        if (enquiryStatus) {
            enquiryStatus.is_deleted = true;
            await enquiryStatus.save();
            func.response.successJson['data'] = enquiryStatus
            return jsend(func.response.successJson, "Successfully plan was deleted");
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

module.exports = { getAllEnquiryStatus, createEnquiryStatus, updateEnquiryStatus, deleteEnquiryStatus, getEnquiryStatusById };