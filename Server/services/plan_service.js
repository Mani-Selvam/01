let func = require('../config/index');
const { ObjectId } = require('bson');
const planSchema = require('../models/plan_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');

const getAllPlan = async (req, res) => {
    try {
        let obj = {};
        obj.is_deleted = false;
        let findAllPlan = await planSchema.find(obj);
        if (findAllPlan) {
            findAllPlan.sort((a, b) => {
                return a.noOfUser - b.noOfUser;
              });
            let returnObj = {};
            returnObj.totalCount = findAllPlan.length
            returnObj.plans = findAllPlan
            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the plans");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};

let getPlanById = async (req, res) => {
    try {
        let findplan = await planSchema.findOne({ _id: req.query.id, is_deleted: false });
        if (findplan) {
            func.response.successJson['data'] = findplan;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createPlan = async (req, res) => {
    try {
        let findParticular = await planSchema.findOne({
            $and: [
                {
                    planName: req.body.planName
                },
                { is_deleted: false }
            ]
        });
        if (findParticular) {
            if (findParticular.planName === req.body.planName) {
                return jsend(200, "PlanName already exists");
            }
        }
        else {
            const price = parseFloat(req.body.price) || 0;
            console.log("price", price);
            
            const gstPercentage = parseFloat(req.body.gstPercentage) || 0;
            console.log("gstPercentage", gstPercentage);
            
            const totalPrice = price + (price * gstPercentage) / 100;
            console.log("totalPrice", totalPrice);
            req.body.totalPrice = totalPrice;
            let createNewPlan = new planSchema(req.body);
            createNewPlan = await createNewPlan.save();
            func.response.successJson['data'] = createNewPlan;
            return jsend(func.response.successJson);
        }
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updatePlan = async (req, res) => {
    try {
        let findplan = await planSchema.findOne({ _id: req._id, is_deleted: false });
        if (findplan) {
            _.each(Object.keys(req), (key) => {
                findplan[key] = req[key];
            });
            const price = parseFloat(req.price) || 0;
            console.log("price", price);
            
            const gstPercentage = parseFloat(req.gstPercentage) || 0;
            console.log("gstPercentage", gstPercentage);
            
            const totalPrice = price + (price * gstPercentage) / 100;
            console.log("totalPrice", totalPrice);
            req.totalPrice = totalPrice;
            findplan.totalPrice = totalPrice;
            const result = await findplan.save();
            const updatedplan = await planSchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updatedplan;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.error(e);
        return jsend(406, e.message);
    }
}

let deletePlan = async (req, res) => {
    try {
        let findplan = await planSchema.findOne({ _id: req.id });
        if (findplan) {
            findplan.is_deleted = true;
            await findplan.save();
            func.response.successJson['data'] = findplan
            return jsend(func.response.successJson, "Successfully plan was deleted");
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

module.exports = { getAllPlan, createPlan, updatePlan, deletePlan, getPlanById };