let func = require('../config/index');
const { ObjectId } = require('bson');
const planSchema = require('../models/plan_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');
const orderSchema = require('../models/order_model');
const userSchema = require('../models/user_model');
const crypto = require('crypto');
const axios = require('axios');
const Razorpay = require('razorpay');
const config = require("../config/config");
const mongoose = require("mongoose");
// Initialize Razorpay with your API key and secret key
const razorpay = new Razorpay({
    key_id: config.razorpay.key_id,
    key_secret: config.razorpay.key_secret,
});
const MY_SECRET = config.razorpay.key_secret;



const OrderCreation = async (req, res) => {
    try {
        const orderCount = await orderSchema.countDocuments({});
        const receiptValue = `order_receipt_${orderCount + 1}`;
        const options = {
            amount: req.body.amount,
            currency: req.body.currency,
            receipt: receiptValue,
            payment_capture: 1,
        };

        const order = await new Promise((resolve, reject) => {
            razorpay.orders.create(options, (err, order) => {
                if (err) {
                    console.error('Error creating order:', err);
                    reject(err);
                    return jsend(406, err.message);
                } else {
                    resolve(order);
                }
            });
        });

        req.body.razorpay_order_id = order.id;
        req.body.razorpay_order_details = order;
        req.body.amount = req.body.amount / 100 ;
        const createNewOrder = new orderSchema(req.body);
        const savedOrder = await createNewOrder.save();

        func.response.successJson['data'] = savedOrder;
        console.log("func.response.successJson['data'] =", func.response.successJson['data']);
        return jsend(func.response.successJson);

    } catch (e) {
        return jsend(406, e.message);
    }
}
const directOrderCreation = async (req, res) => {
    try {
console.log("LLLLLLLLLLLLLLLLLLLLLLLLogggggggggg",req);
        
        const createNewOrder = new orderSchema(req.body);
        const savedOrder = await createNewOrder.save();

        func.response.successJson['data'] = savedOrder;
        console.log("func.response.successJson['data'] =", func.response.successJson['data']);
        return jsend(func.response.successJson);

    } catch (e) {
        return jsend(406, e.message);
    }
}
const directOrderInActive = async (req, res) => {
    try {
        let findorder = await orderSchema.findOne({ _id: req.body.id });
        if (findorder) {
            findorder.Active = false;
            await findorder.save();

            let findAllUser = await userSchema.find({ company_no: findorder.company_no, is_deleted: false });
            for (let user of findAllUser) {
                user.havePlan = false
                const result = await user.save();
            }

            const planDetails = await planSchema.findOne({ _id: findorder.planId });
            if (planDetails) {
                console.log("planDetails", planDetails);
                findorder.planDetails = planDetails; // Assuming planDetails is the key to add the plan details
            }

            func.response.successJson['data'] = findorder;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let getOrderById = async (req, res) => {
    try {
        if(req.query.id ){
            let findorder = await orderSchema.findOne({ _id: req.query.id });
            if (findorder) {
                const currentDateTime = new Date();
                const validityDateTime = new Date(findorder.validity);
    
    
                if (validityDateTime < currentDateTime && findorder.Active == true) {
                    findorder.Active = false;
                    await findorder.save();
    
                    let findAllUser = await userSchema.find({ company_no: findorder.company_no, is_deleted: false });
                    for (let user of findAllUser) {
                        user.havePlan = false
                        const result = await user.save();
                    }
                }
    
                const planDetails = await planSchema.findOne({ _id: findorder.planId });
                if (planDetails) {
                    console.log("planDetails", planDetails);
                    findorder.planDetails = planDetails; // Assuming planDetails is the key to add the plan details
                }
    
                func.response.successJson['data'] = findorder;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "Failed to find the plan");
            }
        }
         else {
            return jsend(406, "Failed to find the plan");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

const validatePaymentVerification = ({ order_id, payment_id }, signature, secret) => {
    const hmac = crypto.createHmac('sha256', secret);
    const data = `${order_id}|${payment_id}`;
    hmac.update(data);
    const generatedSignature = hmac.digest('hex');
    return signature === generatedSignature;
};

const verifyRazorpaysign = async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        console.log("payment req.body", req.body);

        const isValid = validatePaymentVerification({ order_id, payment_id }, signature, MY_SECRET);

        if (isValid) {
            // Signature verification successful
            const payment = await axios.get(`https://api.razorpay.com/v1/payments/${payment_id}`, {
                auth: {
                    username: razorpay.key_id,
                    password: razorpay.key_secret,
                },
            });

            if (payment.data) {
                return jsend({ success: true, message: 'Payment successful', paymentdetails: payment.data });
            } else {
                console.log("paymentfail response", payment.data);
                return jsend(400, 'Payment verification failed');
            }
        } else {
            // Signature verification failed
            return jsend(400, 'Payment verification failed');
            // return res.status(400).json({ status: 'error', message: 'Payment verification failed' });
        }
    } catch (e) {
        return jsend(406, e.message);
        //  return res.status(406).json({ status: 'error', message: e.message });
    }
};


let razorpaySucess = async (req, res) => {
    try {
        let findOrder = await orderSchema.findOne({ _id: req.order_id });
        if (findOrder) {
            findOrder.status = "Paid"
            findOrder.Active = true
            const currentDate = new Date();
            const oneYearLater = new Date(currentDate);
            oneYearLater.setFullYear(currentDate.getFullYear() + 1);

            findOrder.validity = oneYearLater;
            //  const result = await findOrder.save();
            // const updatednotification = await orderSchema.findOne({ _id: req.order_id  });
            console.log("findOrder", findOrder);

            let findAllActiveOrder = await orderSchema.find({
                userId: req.userId,
                _id: { $ne: req.order_id },
                Active: true
            })

            for (let order of findAllActiveOrder) {
                order.Active = false
                const result = await order.save();
            }

            let findPlan = await planSchema.findOne({ _id: findOrder.planId });
            if (findPlan) {
                var noOfUsers = findPlan.noOfUser
            }

            let finduser = await userSchema.findOne({ _id: req.userId, is_deleted: false });
            if (finduser) {
                finduser.planId = req.planId,
                    finduser.userPaymentDetails = req.paymentdetails;
                finduser.orderId = req.order_id;
                finduser.havePlan = true
                findOrder.company_no = finduser.company_no;
                const result1 = await findOrder.save();
                const result = await finduser.save();
                let findAllUser = await userSchema.aggregate([
                    {
                      $match: {
                        $and: [
                          { company_no: findOrder.company_no },
                          { is_deleted: false }
                        ]
                      }
                    },
                    {
                      $sort: { createdAt: 1 } // Sort by creation date in ascending order
                    },
                    {
                      $facet: {
                        allActiveUsers: [
                          { $match: { status: "Active" } } // Get all users with status "Active"
                        ],
                        firstThreeUsers: [
                          { $match: { status: "Active" } },
                          { $limit: noOfUsers } // Get the first 3 users
                        ]
                      }
                    },
                    {
                      $project: {
                        remainingUsers: {
                          $setDifference: ["$allActiveUsers", "$firstThreeUsers"] // Get remaining users
                        },
                        firstThreeUsers: 1 // Include firstThreeUsers
                      }
                    }
                  ]);
                  
                  
                  console.log(findAllUser);
                 
                  console.log("noOfUsers", noOfUsers);
                  console.log("firstThreeUsers", findAllUser[0].firstThreeUsers);
                  console.log("remainingUsers", findAllUser[0].remainingUsers);
                  
                  // Update first three users
                  for (let user of findAllUser[0].firstThreeUsers) {
                    user.orderId = req.order_id;
                    user.havePlan = true;
                    await userSchema.findByIdAndUpdate(user._id, user);
                  }
                  
                  // Update remaining users
                  for (let user of findAllUser[0].remainingUsers) {
                    user.orderId = req.order_id;
                    user.havePlan = false;
                    await userSchema.findByIdAndUpdate(user._id, user);
                  }
        
                  console.log("firstThreeUsers2222", findAllUser[0].firstThreeUsers);
                  console.log("remainingUsers22222222", findAllUser[0].remainingUsers);

                const updateduser = await userSchema.findOne({ _id: req.userId });
                func.response.successJson['data'] = updateduser;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "Failed to find the user");
            }

        } else {
            return jsend(406, "Failed to find the Order");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
}

let razorpayFailure = async (req, res) => {
    try {
        let findOrder = await orderSchema.findOne({ _id: req.order_id });
        if (findOrder) {
            const result = await orderSchema.deleteOne({ _id: req.order_id });
            if (result.deletedCount > 0) {
                return jsend(func.response.successJson);

            } else {
                return jsend(func.response.errorJson, "Order not found for deletion");
                console.log('Order not found for deletion:', req.order_id);
            }
        } else {
            return jsend(406, "Failed to find the Order");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
}

module.exports = { OrderCreation, verifyRazorpaysign, razorpaySucess, razorpayFailure, getOrderById ,directOrderCreation,directOrderInActive};