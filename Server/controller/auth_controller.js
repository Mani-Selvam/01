
const authMasterService = require('../services/auth_service');
const mailMasterService = require('../services/mail_service');

const authRegister = async (req, res) => {
    try {
        const opData = await authMasterService.authRegister(req)
     
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}
const authLogin = async (req, res) => {
    try {
        const opData = await authMasterService.authLogin(req)   
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const changePassword = async (req, res) => {
    try {
        const opData = await authMasterService.changePassword(req)   
        return res.send(opData)
    } catch (err) {
        console.log(err)
        return res.send(err)
    }
}

const logout = async (req, res) => {
  try {
      const opData = await authMasterService.logout(req)   
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}


const sendOTPEmail = async (req, res) => {
  try {
      const opData = await mailMasterService.sendOTPEmail(req)
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}
const forgotpasswordOTPEmail = async (req, res) => {
  try {
      const opData = await mailMasterService.forgotPasswordOTP(req)  
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}

const verifyOTP = async (req, res) => {
    const { email, enteredOTP } = req.body;
  
    try {
      const isVerified = await mailMasterService.verifyOTP({ email, enteredOTP });
      if (isVerified) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ error: 'Invalid OTP' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  }

module.exports = {  authLogin ,authRegister,changePassword,sendOTPEmail,verifyOTP,forgotpasswordOTPEmail,logout };