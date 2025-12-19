
const userMasterService = require('../services/user_service');

 const getAllUser = async (req, res) => {
    try {
        const opData = await userMasterService.getAllUser(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const getUserById = async (req, res) => {
    try {
        const opData = await userMasterService.getUserById(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const createUser = async (req, res) => {
    try {
        const opData = await userMasterService.createUser(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateUser = async (req, res) => {
    try {
        const opData = await userMasterService.updateUser(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const deleteUser = async (req, res) => {
    console.log("eeeeeeccc",req);
    try {
        const opData = await userMasterService.deleteUser(req.query)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const updateappversion = async (req, res) => {
    try {
        const opData = await userMasterService.updateappversion(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const getcurrentversion = async (req, res) => {
    try {
        const opData = await userMasterService.getcurrentversion()
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
module.exports = {  getAllUser,getUserById ,createUser,updateUser ,deleteUser,updateappversion,getcurrentversion};