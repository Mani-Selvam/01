let func = require('../config/index');
const { ObjectId } = require('bson');
const couponSchema = require('../models/coupon_model');
const orderSchema = require('../models/order_model');
const planSchema = require('../models/plan_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

 const getAllCoupon = async (req,res) => {
    try {
        let obj = {};
        obj.is_deleted = false;
        let findAllCoupon = await couponSchema.find(obj);
        if (findAllCoupon) {
            let returnObj = {};
            returnObj.totalCount = findAllCoupon.length
            returnObj.coupons = findAllCoupon.reverse()
            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the coupons");
        }
    } catch (e) {
        return jsend(406, e.message);
    }  
};

let getCouponById = async (req, res) => {
    try {
        let findcoupon = await couponSchema.findOne({ _id: req.query.id,is_deleted: false});
        if (findcoupon) {
            func.response.successJson['data'] = findcoupon;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the coupon");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createCoupon = async (req, res) => {
    try {
        let findParticular = await couponSchema.findOne({
            $and: [
                {
                 couponName: req.body.couponName 
                },
                { is_deleted: false }
              ]
          });
          if (findParticular) {
            if (findParticular.couponName === req.body.couponName) {
              return jsend(200, "CouponName already exists");
            } 
          }
          else{

            console.log("req.body",req.body);

            let createNewCoupon = new couponSchema(req.body);
            createNewCoupon = await createNewCoupon.save();
            func.response.successJson['data'] = createNewCoupon;
            return jsend(func.response.successJson);
          }     
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateCoupon = async (req, res) => {
    try {
        let findcoupon = await couponSchema.findOne({ _id: req._id ,is_deleted: false});
        if (findcoupon) {
            _.each(Object.keys(req), (key) => {
                findcoupon[key] = req[key];
            });

            const result = await findcoupon.save();
            const updatedcoupon = await couponSchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updatedcoupon;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the coupon");
        }
    } catch (e) {
        console.error(e);
        return jsend(406, e.message);
    }
}

let deleteCoupon = async (req, res) => {
    try {
        console.log("deleteCoupon", req.id );
        let findcoupon = await couponSchema.findOne({ _id: req.id });
        if (findcoupon) {
            findcoupon.is_deleted = true;
            await findcoupon.save();
         
            func.response.successJson['data'] = findcoupon
            return jsend(func.response.successJson,"Successfully coupon was deleted");
        } else {
            return jsend(406, "Failed to find the coupon");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}
let applyCoupon = async (req, res) => {
    try {
        let findorder = await orderSchema.findOne({ userId:req.userId,couponName:req.couponName });
        console.log("reqqfindorderqqqq", findorder);

        if (!findorder) {
            let findcoupon = await couponSchema.findOne({ couponName: req.couponName, is_deleted: false });
            if (findcoupon) {
                console.log("findcoupon", findcoupon);
                const currentDate = moment();
                if (
                    findcoupon &&
                    findcoupon.from &&
                    findcoupon.to &&
                    (
                        currentDate.isBetween(moment(findcoupon.from, 'DD-MM-YYYY'), moment(findcoupon.to, 'DD-MM-YYYY'), null, '[]') ||
                        currentDate.isSame(moment(findcoupon.from, 'DD-MM-YYYY'), 'day') ||
                        currentDate.isSame(moment(findcoupon.to, 'DD-MM-YYYY'), 'day')
                    )
                ) {
                    let findplan = await planSchema.findOne({ _id: req.planId, is_deleted: false });
                    if (findplan) {
                        console.log("findplan", findplan);
                        var finalDiscountAmount
                        let price = findplan.price || 0;
                        const gstPercentage = findplan.gstPercentage || 0;

                        if(findcoupon.discountAmount){
                            price = price - findcoupon.discountAmount;
                            finalDiscountAmount = String(findcoupon.discountAmount) 
                        }
                        else if(findcoupon.discountPercentage){
                            const discountPercentage = findcoupon.discountPercentage
                            finalDiscountAmount = ((price * discountPercentage) / 100).toFixed(2).replace(/\.?0*$/, '');
                            price = (price - (price * discountPercentage) / 100);
                            
                        }
                    
                        let totalPrice = (price + (price * gstPercentage) / 100).toFixed(2);
                        totalPrice = totalPrice.replace(/\.?0*$/, '');               
                        let returnObj = {
                            actualPrice: findplan.price,
                            discountAmount: finalDiscountAmount,
                            gstPercentage: gstPercentage,
                            totalprice: totalPrice,
                        };

                        func.response.successJson['data'] = returnObj;
                        return jsend(func.response.successJson);
                    }
                } else {
                    // Coupon is expired or not valid
                    return jsend(406, 'Coupon is expired or not valid.');
                }
            } else {
                return jsend(406, 'Failed to find the coupon');
            }
        } else {
            return jsend(200, 'You have already used this coupon');
        }
    } catch (e) {
        console.error(e);
        return jsend(500, 'Internal Server Error');
    }
};
module.exports = {  getAllCoupon,createCoupon, updateCoupon,deleteCoupon,getCouponById,applyCoupon };