let func = require('../config/index');
const { ObjectId } = require('bson');
const aboutContentSchema = require('../models/aboutcontent_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');

const getAllAboutContent = async (req, res) => {
    try {
        let obj = {};
        let findAllAboutContent = await aboutContentSchema.find(obj);
        if (findAllAboutContent) {
            let returnObj = {};
            returnObj.totalCount = findAllAboutContent.length
            returnObj.aboutContents = findAllAboutContent
            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the aboutContents");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};



let createAboutContent = async (req, res) => {
    try {
        let findParticular = await aboutContentSchema.findOne({
            $and: [
                {
                    aboutContentName: req.body.aboutContentName
                },
                { is_deleted: false }
            ]
        });
        if (findParticular) {
            if (findParticular.aboutContentName === req.body.aboutContentName) {
                return jsend(200, "aboutContentName already exists");
            }
        }
        else {
            const price = req.body.price || 0;
            const gstPercentage = req.body.gstPercentage || 0;
            const totalPrice = price + (price * gstPercentage) / 100;

            req.body.totalPrice = totalPrice;
            let createNewAboutContent = new aboutContentSchema(req.body);
            createNewAboutContent = await createNewAboutContent.save();
            func.response.successJson['data'] = createNewAboutContent;
            return jsend(func.response.successJson);
        }
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateAboutContent = async (req, res) => {
    try {
      
        let findaboutContent = await aboutContentSchema.findOne({ _id: req._id});
        if (findaboutContent) {
            console.log("reqppppppp",req.aboutContent)
            req.aboutContent = req.aboutContent.changingThisBreaksApplicationSecurity 

            _.each(Object.keys(req), (key) => {
                findaboutContent[key] = req[key];
            });
            console.log("reqppppppp",findaboutContent)
            const result = await findaboutContent.save();
            const updatedaboutContent = await aboutContentSchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updatedaboutContent;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the aboutContent");
        }
    } catch (e) {
        console.error(e);
        return jsend(406, e.message);
    }
}



module.exports = { getAllAboutContent, createAboutContent, updateAboutContent };