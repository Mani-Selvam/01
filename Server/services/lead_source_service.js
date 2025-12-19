let func = require('../config/index');
const { ObjectId } = require('bson');
const leadSourceSchema = require('../models/lead_source.model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');

const getAllLeadSource = async (req) => {
    try {
        let leadSource = await leadSourceSchema.find({userId : req.query.userId,is_deleted: false});
        console.log("leadSource",leadSource)
        if (leadSource) {
            func.response.successJson['data'] = leadSource;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the plans");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};

let getLeadSourceById = async (req, res) => {
    try {
        let leadSource = await leadSourceSchema.findOne({ _id: req.query.id, is_deleted: false });
        if (leadSource) {
            func.response.successJson['data'] = leadSource;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createLeadSource = async (req, res) => {
    try {

        let createLeadSource = await leadSourceSchema.create(req.body);
        func.response.successJson['data'] = createLeadSource;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateLeadSource = async (id, body) => {
    try {
        // , is_deleted: false 
        let leadSource = await leadSourceSchema.findOne({ _id: id});
        if (leadSource) {
            Object.assign(leadSource, body);
            await leadSource.save();
            func.response.successJson['data'] = leadSource;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.error(e);
        return jsend(406, e.message);
    }
}

let deleteLeadSource = async (id) => {
    try {
        let leadSource = await leadSourceSchema.findOne({ _id: id });
        if (leadSource) {
            leadSource.is_deleted = true;
            await leadSource.save();
            func.response.successJson['data'] = leadSource
            return jsend(func.response.successJson, "Successfully plan was deleted");
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

module.exports = { getAllLeadSource, createLeadSource, updateLeadSource, deleteLeadSource, getLeadSourceById };