let func = require('../config/index');
const { ObjectId } = require('bson');
const userSchema = require('../models/user_model');
const jsend = require('../constant/jsend')
const bcrypt = require("bcrypt");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

const authRegister = async (req, res) => {
  try {
    console.log("req.payload.emailId", req.body);
    let findParticular = await userSchema.findOne({
      $and: [
        {
          $or: [
            { emailId: req.body.emailId },
            { mobile_no: req.body.mobile_no }
          ]
        },
        { is_deleted: false }
      ]
    });
    console.log("findParticular", findParticular);
    if (findParticular) {

      if (findParticular.emailId === req.body.emailId && findParticular.is_deleted == false) {
        return jsend(200, "Email already exists");
      } else if (findParticular.mobile_no === req.body.mobile_no && findParticular.is_deleted == false) {
        return jsend(200, "Mobile already exists");
      }
    }
    if (!req.body.company_no) {
      const latestEntry = await userSchema.findOne({ user_type: 'Admin' }).sort({ _id: -1 }).lean();
      // const latestEntry = await userSchema.findOne().sort({ _id: -1 }).lean();
      console.log("latestEntry", latestEntry);
      const nextCompanyNo = latestEntry ? Number(latestEntry.company_no) + 1 : 1;
      console.log("nextCompanyNo", nextCompanyNo);
      req.body.company_no = nextCompanyNo.toString();
    }
    console.log("new body", req.body);
    const latestEntry = await userSchema.findOne().sort({ _id: -1 }).lean();
    const nextEntryNo = latestEntry ? Number(latestEntry.userId) + 1 : 1;

    req.body.userId = nextEntryNo.toPrecision();
    req.body.original_password = req.body.password
    req.body.password = bcrypt.hashSync(req.body?.password, 10);
    req.body.status = "Active"
    let createNewUser = new userSchema(req.body);
    createNewUser = await createNewUser.save();
    func.response.successJson['data'] = createNewUser;
    return jsend(func.response.successJson);
  } catch (e) {
    return jsend(406, e.message);
  }
}
const authLogin = async (req, res) => {
  try {
    console.log("Login request body", req.body);
    let loginDetail = await userSchema.findOne({
      $and: [
        {
          $or: [
            { emailId: req.body.email_mob },
            { mobile_no: req.body.email_mob }
          ]
        },
        { is_deleted: false },
      ]
    });
    if (!loginDetail) {
      console.log("Login !loginDetail ");
      return jsend(400, "Invailed username or password");
    }
    if (loginDetail.is_deleted == true) {
      console.log("Your account is deleted");
      return jsend(406, "Your account is deleted")
    }
    if (loginDetail.loginStatus == true) {
      console.log("Your account login in another device");
      return jsend(400, "Your account login in another device")
    }
    if (loginDetail.status != "Active") {
      console.log("Your account is inactive");
      console.log("userdetail active", loginDetail.status != "Active");
      return jsend(406, "Your account is inactive")
    }
    let jwtSecretKey = config.jwt.secretKey;
    let jwtSecretKeyexpire = config.jwt.expiration;
    if (loginDetail) {
      console.log("If loginDetail",);
      let passwordcheck = await bcrypt.compareSync(req.body.password, loginDetail.password);
      if (passwordcheck) {
        loginDetail.type = "LogIn";
        const token = await jwt.sign({ user_id: loginDetail._id }, jwtSecretKey, { expiresIn: jwtSecretKeyexpire });
        loginDetail.token = token;
        loginDetail.loginStatus = true;
        loginDetail = await loginDetail.save();
        let obj = loginDetail.toObject();
        delete obj.password;
        console.log("User successfully login", loginDetail);
        return jsend(200, "User successfully login", obj);
      } else {
        console.log("Invailed username or password");
        return jsend(400, "Invailed username or password");
      }
    } else {
      console.log("Failed to find the user",);
      return jsend(400, "Failed to find the user");
    }
  } catch (e) {
    console.log("e.message", e.message)
    return jsend(406, e.message);
  }
}

const changePassword = async (req, res) => {
  try {
    let findParticular = await userSchema.findOne({
      emailId: req.body.emailId
    });
    if (findParticular) {
      console.log("findParticularrrrrr", findParticular);
      findParticular.original_password = req.body.password
      findParticular.password = bcrypt.hashSync(req.body.password, 10);
      await findParticular.save();
      func.response.successJson['data'] = findParticular;
      return jsend(func.response.successJson);
    } else {
      return jsend(406, "Email is not found");
    }

  } catch (e) {
    return jsend(406, e.message);
  }
}

const logout = async (req, res) => {
  try {
    let findParticular = await userSchema.findOne({
      _id: req.body.id
    });
    if (findParticular) {
      findParticular.loginStatus = false;
      await findParticular.save();
      func.response.successJson['data'] = findParticular;
      return jsend(func.response.successJson);
    } else {
      return jsend(406, "Email is not found");
    }

  } catch (e) {
    return jsend(406, e.message);
  }
}

module.exports = { authRegister, authLogin, changePassword, logout };