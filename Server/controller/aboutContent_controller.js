
const aboutContentMasterService = require('../services/aboutContent_service');

 const getAllAboutContent = async (req, res) => {
    try {
        const opData = await aboutContentMasterService.getAllAboutContent(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const createAboutContent = async (req, res) => {
    try {
        const opData = await aboutContentMasterService.createAboutContent(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const updateAboutContent = async (req, res) => {
    try {
        const opData = await aboutContentMasterService.updateAboutContent(req.body)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}


module.exports = {  getAllAboutContent ,createAboutContent,updateAboutContent };