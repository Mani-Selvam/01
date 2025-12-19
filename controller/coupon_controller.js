
const couponMasterService = require('../services/coupon_service');

 const getAllCoupon = async (req, res) => {
    try {
        const opData = await couponMasterService.getAllCoupon(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getCouponById = async (req, res) => {
    try {
        console.log("33333333333333333333333333");
        const opData = await couponMasterService.getCouponById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createCoupon = async (req, res) => {
    try {
        const opData = await couponMasterService.createCoupon(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateCoupon = async (req, res) => {
    try {
        const opData = await couponMasterService.updateCoupon(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteCoupon = async (req, res) => {
    console.log("eeeeeeccc",req);
    try {
        const opData = await couponMasterService.deleteCoupon(req.query)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const applyCoupon = async (req, res) => {
    try {
        const opData = await couponMasterService.applyCoupon(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllCoupon,getCouponById ,createCoupon,updateCoupon ,deleteCoupon,applyCoupon};