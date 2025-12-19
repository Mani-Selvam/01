const config = require("../config/config");
const nodeCCAvenue = require('node-ccavenue');
const CryptoJS = require("crypto-js");
const crypto = require('crypto');
var express = require("express");
var paymentRouter = express.Router();
const Razorpay = require('razorpay');
const paymentMasterService = require('../services/payment_service');
// Initialize Razorpay with your API key and secret key
const razorpay = new Razorpay({
  key_id: 'your_key_id',
  key_secret: 'your_key_secret',
});

const encryptionKey = crypto.randomBytes(32).toString('hex');


const verifyRazorpayTransaction = async (req, res) => {
  try {
      const opData = await paymentMasterService.verifyRazorpaysign(req)
   
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}

const razorpaySucess = async (req, res) => {
  try {
      const opData = await paymentMasterService.razorpaySucess(req.body)
   
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}
const razorpayFailure = async (req, res) => {
  try {
      const opData = await paymentMasterService.razorpayFailure(req.body)
   
      return res.send(opData)
  } catch (err) {
      console.log(err)
      return res.send(err)
  }
}

const OrderCreation = async (req, res) => {

  try {
    const opData = await paymentMasterService.OrderCreation(req)
 
    return res.send(opData)
} catch (err) {
    console.log(err)
    return res.send(err)
}

}
const directOrderCreation = async (req, res) => {

  try {
    const opData = await paymentMasterService.directOrderCreation(req)
 
    return res.send(opData)
} catch (err) {
    console.log(err)
    return res.send(err)
}

}
const getOrderById = async (req, res) => {

  try {
    const opData = await paymentMasterService.getOrderById(req)
 
    return res.send(opData)
} catch (err) {
    console.log(err)
    return res.send(err)
}

}
const directOrderInActive = async (req, res) => {

  try {
    const opData = await paymentMasterService.directOrderInActive(req)
 
    return res.send(opData)
} catch (err) {
    console.log(err)
    return res.send(err)
}

}

const handlePaymentControllerPhone = async (req, res, next) => {
  try {
      const keys= {
          "working_key": config.paymentGateway.working_key,
          "access_code": config.paymentGateway.access_code
        }

    const ccav = new nodeCCAvenue.Configure({
      ...keys,
      merchant_id: config.paymentGateway.merchant_id,
    });
    const orderParams = {
      redirect_url: encodeURIComponent(
        `${config.baseUrl}api/response?access_code=${config.paymentGateway.access_code}&working_key=${config.paymentGateway.working_key}`
      ),
      cancel_url: encodeURIComponent(
        `${config.baseUrl}api/response?access_code=${config.paymentGateway.access_code}&working_key=${config.paymentGateway.working_key}`
      ),
      billing_name: req.body.orderParams.billing_name,
      currency: "INR",
      ...req.body.orderParams,
    };
    const encryptedOrderData = ccav.getEncryptedOrder(orderParams);
    res.setHeader("content-type", "application/json");
    res.status(200).json({
      payLink: `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&access_code=${config.paymentGateway.access_code}&encRequest=${encryptedOrderData}`,
    });
  } catch (err) {
    next(err);
  }
}

const handleResponsePaymentController = async (req, res, next) => {
try {
    var encryption = req.body.encResp;
    const ccav = new nodeCCAvenue.Configure({
        ...req.query,
        merchant_id: config.paymentGateway.merchant_id,
    });
    var ccavResponse = ccav.redirectResponseToJson(encryption);
    var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(ccavResponse),
        encryptionKey
    ).toString();

    const urlEncodedCiphertext = encodeURIComponent(ciphertext);
    if (ccavResponse["order_status"] == "Success") {
        res.redirect(
            `${config.baseUrl}transaction?type=success&val=${urlEncodedCiphertext}`
        );
    } else {
        res.redirect(
            `${config.baseUrl}transaction?val=${urlEncodedCiphertext}`
        );
    }
} catch (error) {
    next(error);
}
}

const decryptData = (encryptedData, key) => {
try {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
} catch (error) {
  console.error('Decryption Error:', error);
  throw new Error('Decryption failed');
}
};

const handleTransaction = async (req, res, next) => {
try {
  const type = req.query.type;
  const val = req.query.val;
  const decryptedData = decryptData(val, encryptionKey);

  if (type === 'success') {
    console.log("payment successe");
    res.send(`Transaction successful! Decrypted data: ${decryptedData}`);
  } else {
    console.log("payment failure");
    res.send(`Transaction failed! Decrypted data: ${decryptedData}`);
  }
} catch (error) {
  next(error);
}
};


module.exports = {  handleResponsePaymentController,handlePaymentControllerPhone,handleTransaction,directOrderInActive,
  decryptData,OrderCreation,verifyRazorpayTransaction,razorpaySucess,razorpayFailure,getOrderById,directOrderCreation};