const userSchema = require('../models/user_model');
const config = require('../config/config');
const otpStorage = {};
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jsend = require('../constant/jsend')
const enquirySchema = require('../models/enquiry_model');
const cron = require('node-cron');
const moment = require('moment-timezone');
const admin = require('../config/firebase'); // Import the Firebase Admin SDK
const notificationSchema = require('../models/notification_model');

var findAllTodayEnquiry = []
var findAllMissedEnquiry =[]

cron.schedule('* * * * *', async () => {
  try {
    console.log("Finding Today enquiry in background");
    findAllTodayEnquiry = await findTodayEnquiry();
    sendPushNotification();
    sendPushNotificationHourBefore();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

cron.schedule('0 6 * * *', async () => {
  try {
    findAllMissedEnquiry = await findMissedEnquiry();
    sendRememberPushNotification();
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

//push notification

let findTodayEnquiry = async () => {
  try {
    let findAllTodayEnquiry = [];
    const obj = {};
    obj.enquiry_status = "Followup";

    findAllTodayEnquiry = await enquirySchema.find(obj);

    findAllTodayEnquiry = findAllTodayEnquiry.filter(enquiry => {
      const date = moment(enquiry["next_followUp_date"], 'DD-MM-YYYY');
      const today = moment().startOf('day');
      return date.isSame(today);
    });
    return findAllTodayEnquiry;
  } catch (e) {
    console.error(e);
    throw e; // Re-throw the error to be caught by the calling function
  }
}

let findMissedEnquiry = async () => {
  try {
    let findAllMissedEnquiry = [];
    const obj = {};
    obj.enquiry_status = "Followup";

    findAllMissedEnquiry = await enquirySchema.find(obj);

    findAllMissedEnquiry = findAllMissedEnquiry.filter(enquiry => {
      const date = moment(enquiry["next_followUp_date"], 'DD-MM-YYYY');
      const today = moment().startOf('day');
      return date.isBefore(today); // Check if date is before today's date
    });
    return findAllMissedEnquiry;
  } catch (e) {
    console.error(e);
    throw e; // Re-throw the error to be caught by the calling function
  }
}


let sendPushNotification = async (req, res) => {
  try {
    const moment = require('moment-timezone');
    const currentDateTime = moment().tz('Asia/Kolkata').startOf('minute'); 
    let findThisTimeEnquiry = findAllTodayEnquiry.filter(enquiry => {
      const followUpDateTime = moment(enquiry["next_followUp_date"], 'DD-MM-YYYY HH:mm').startOf('minute');
      console.log("followUpDateTime matched-----", followUpDateTime.format('DD-MM-YYYY HH:mm'));
      console.log("currentDateTime------------", currentDateTime.format('DD-MM-YYYY HH:mm'));
    
      // Check if followUpDateTime's minute matches currentDateTime's minute
      const isSameMinute = followUpDateTime.format('HH:mm') === currentDateTime.format('HH:mm');
      console.log("Is same minute:", isSameMinute);
    
      return isSameMinute;
    });

 const findUserForEnquiries = async (enquiries) => {
      try {
        console.log("enquiries list",enquiries);
        for (const enquiry of enquiries) {
          let user = await userSchema.findOne({ _id: enquiry.followUp_by ,is_deleted: false});     
          if (user && user.firebase_usertoken && user.firebase_usertoken.length > 0) {
            const tokens = user.firebase_usertoken;
            console.log("fcm tokens list",tokens);
            const notificationPromises = tokens.map(async (registrationToken) => {
              const message = {
                data: {
                  enquiry_no: String(enquiry.enquiry_no),
                  enquiryId: String(enquiry._id),
                  notificationTime: String(enquiry.next_followUp_date),
                },
                notification: {
                  title: 'Followup Notification',
                  body: 'Enquiry ' + enquiry.enquiry_no + ' followup time'
                },
                token: registrationToken,
              };
        
              let bodyDATA = {
                message: message,
                read: false,
                userId: enquiry.followUp_by,
              };
        
              let createNewNotification = new notificationSchema(bodyDATA);
              createNewNotification = await createNewNotification.save();
        
              return admin.messaging().send(message).then((response) => {
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
                if (error.code === 'messaging/registration-token-not-registered') {
                  console.log('Catch error: Registration token not registered. Remove or update in your database.');
                }
              });;
            });
        
            // Wait for all notifications to be sent
            try {
              await Promise.all(notificationPromises);
              console.log('Successfully sent notifications for enquiry:', enquiry.enquiry_no);
            } catch (error) {
              console.log('Error sending notifications:', error);
              if (error.code === 'messaging/registration-token-not-registered') {
                console.log('All notificatipon error :Registration token not registered. Remove or update in your database.');
              }
            }
          } else {
            console.log('User, registration token, or empty token array not found. Skipping...');
          }
        }
        // if (res) {
        //   res.send('Notifications sent successfully');
        // }
      } catch (error) {
        console.error("Error finding users:", error);
        if (res) {
          res.status(500).send('Error sending notifications');
        }
      }
    };

    await findUserForEnquiries(findThisTimeEnquiry);

  } catch (error) {
    console.error('Error:', error);
    return jsend(500, 'Internal Server Error', error.toString());
  }
};
let sendPushNotificationHourBefore = async (req, res) => {
  try {
    const moment = require('moment-timezone');
    const currentDateTime = moment().tz('Asia/Kolkata').startOf('minute');
    const oneHourLater = currentDateTime.clone().add(1, 'hour');
    let findThisTimeEnquiry2 = findAllTodayEnquiry.filter(enquiry => {
      const followUpDateTime = moment(enquiry["next_followUp_date"], 'DD-MM-YYYY HH:mm').startOf('minute');
      const isSameMinute = followUpDateTime.format('HH:mm') === oneHourLater.format('HH:mm');
      return isSameMinute;
    });

 const findUserForEnquiries2 = async (enquiries) => {
      try {
        for (const enquiry of enquiries) {
          let user = await userSchema.findOne({ _id: enquiry.followUp_by ,is_deleted: false});     
          if (user && user.firebase_usertoken && user.firebase_usertoken.length > 0) {
            const tokens = user.firebase_usertoken;
            const notificationPromises = tokens.map(async (registrationToken) => {
              const message = {
                data: {
                  enquiry_no: String(enquiry.enquiry_no),
                  enquiryId: String(enquiry._id),
                  notificationTime: String(enquiry.next_followUp_date),
                },
                notification: {
                  title: 'Followup Notification',
                  body: 'Enquiry ' + enquiry.enquiry_no + ' followup by '+enquiry.next_followUp_date,
                },
                token: registrationToken,
              };
        
              let bodyDATA = {
                message: message,
                read: false,
                userId: enquiry.followUp_by,
              };
        
              let createNewNotification = new notificationSchema(bodyDATA);
              createNewNotification = await createNewNotification.save();
        
              return admin.messaging().send(message).then((response) => {
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
                if (error.code === 'messaging/registration-token-not-registered') {
                  console.log('Catch error: Registration token not registered. Remove or update in your database.');
                }
              });;
            });
        
            // Wait for all notifications to be sent
            try {
              await Promise.all(notificationPromises);
              console.log('Successfully sent notifications for enquiry:', enquiry.enquiry_no);
            } catch (error) {
              console.log('Error sending notifications:', error);
              if (error.code === 'messaging/registration-token-not-registered') {
                console.log('All notificatipon error :Registration token not registered. Remove or update in your database.');
              }
            }
          } else {
            console.log('User, registration token, or empty token array not found. Skipping...');
          }
        }
        // if (res) {
        //   res.send('Notifications sent successfully');
        // }
      } catch (error) {
        console.error("Error finding users:", error);
        if (res) {
          res.status(500).send('Error sending notifications');
        }
      }
    };

    await findUserForEnquiries2(findThisTimeEnquiry2);



  } catch (error) {
    console.error('Error:', error);
    return jsend(500, 'Internal Server Error', error.toString());
  }
};
let sendRememberPushNotification = async (req, res) => {
  try {


 const findUserForEnquiries = async (enquiries) => {
      try {
        console.log("Missed enquiries list",enquiries);
        for (const enquiry of enquiries) {
          let user = await userSchema.findOne({ _id: enquiry.followUp_by ,is_deleted: false});     
          if (user && user.firebase_usertoken && user.firebase_usertoken.length > 0) {
            const tokens = user.firebase_usertoken;
            console.log("fcm tokens list",tokens);
            const notificationPromises = tokens.map(async (registrationToken) => {
              const message = {
                data: {
                  enquiry_no: String(enquiry.enquiry_no),
                  enquiryId: String(enquiry._id),
                  notificationTime: String(enquiry.next_followUp_date),
                },
                notification: {
                  title: 'Reminder: Followup '+ enquiry.enquiry_no +' is missed',
                  body: 'Dont miss out on managing your enquiries and following them up on time'
                },
                token: registrationToken,
              };
        
              let bodyDATA = {
                message: message,
                read: false,
                userId: enquiry.followUp_by,
              };
        
              let createNewNotification = new notificationSchema(bodyDATA);
              createNewNotification = await createNewNotification.save();
        
              return admin.messaging().send(message).then((response) => {
                console.log('Successfully sent message:', response);
              })
              .catch((error) => {
                console.log('Error sending message:', error);
                if (error.code === 'messaging/registration-token-not-registered') {
                  console.log('Catch error: Registration token not registered. Remove or update in your database.');
                }
              });;
            });
        
            // Wait for all notifications to be sent
            try {
              await Promise.all(notificationPromises);
              console.log('Successfully sent notifications for enquiry:', enquiry.enquiry_no);
            } catch (error) {
              console.log('Error sending notifications:', error);
              if (error.code === 'messaging/registration-token-not-registered') {
                console.log('All notificatipon error :Registration token not registered. Remove or update in your database.');
              }
            }
          } else {
            console.log('User, registration token, or empty token array not found. Skipping...');
          }
        }
        // if (res) {
        //   res.send('Notifications sent successfully');
        // }
      } catch (error) {
        console.error("Error finding users:", error);
        if (res) {
          res.status(500).send('Error sending notifications');
        }
      }
    };

    await findUserForEnquiries(findAllMissedEnquiry);

  } catch (error) {
    console.error('Error:', error);
    return jsend(500, 'Internal Server Error', error.toString());
  }
};

// send mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.nodemailer.user,
    pass: config.nodemailer.pass,
  },
});
const generateNumericOTP = (length) => {
  const digits = '0123456789';
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((value) => digits[value % 10])
    .join('');
};
let sendOTPEmail = async (req, res) => {
  const to = req.body.to;
  const otp = generateNumericOTP(4);
  const msg = {
    to: to,
    from: config.nodemailer.user,
    subject: config.nodemailer.from_name + ': Your OTP for Account Verification',
    text: `Your OTP is: ${otp}`,
    html: `<p>Hi,</p>
           <p>To complete the account verification process, please use the following one-time password (OTP):</p>
           <p><strong>Your OTP: ${otp}</strong></p>
           <p>For security reasons, please do not share this OTP with anyone. If you did not request this OTP, please ignore this email.</p>
           <p>Thank you.</p>`
  };

  try {
    let findParticular = await userSchema.findOne({ emailId: to, is_deleted: false });

    if (findParticular) {
      return jsend(400, 'Emailid already exists');
    } else {
      let sendMailResponse = await sendMailAsync(transporter, msg);
      if (!sendMailResponse.success) {
        console.error('Nodemailer error:', sendMailResponse.error);
        return jsend(406, 'Failed to send OTP email', sendMailResponse.error.toString());
      } else {
        console.log('Email sent: otp sent ', sendMailResponse.info.response);
        delete otpStorage[to];
        otpStorage[to] = otp;
        console.error('Nodemailer otpStorage[to]:', otpStorage[to]);
        return jsend(200, 'OTP sent successfully');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return jsend(500, 'Internal Server Error', error.toString());
  }
};

let forgotPasswordOTP = async (req, res) => {
  const to = req.body.to;
  const otp = generateNumericOTP(4);
  const msg = {
    to: to,
    from: config.nodemailer.user,
    subject: config.nodemailer.from_name + ': Your OTP for Forgotpassword Verification',
    text: `Your OTP is: ${otp}`,
    html: `<p>Hi,</p>

    <p>We received a request to reset your password. To complete the process, please use the following one-time password (OTP):</p>
    
    <p><strong>Your OTP: ${otp}</strong></p>
    
    <p>For security reasons, please do not share this OTP with anyone. If you did not request this OTP, please ignore this email.</p>
    <p>Thank you.</p>`
  };

  try {
    let findParticular = await userSchema.findOne({ emailId: to, is_deleted: false });

    if (!findParticular) {
      console.log(findParticular);
      return jsend(400, 'Enter registered Emailid');
    } else {
      // Send email
      let sendMailResponse = await sendMailAsync(transporter, msg);
      if (!sendMailResponse.success) {
        console.error('Nodemailer error:', sendMailResponse.error);
        return jsend(406, 'Failed to send OTP email', sendMailResponse.error.toString());
      } else {
        console.log('Email sent: otp sent ', sendMailResponse.info.response);
        delete otpStorage[to];
        otpStorage[to] = otp;
        console.error('Nodemailer otpStorage[to]:', otpStorage[to]);
        return jsend(200, 'OTP sent successfully');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return jsend(500, 'Internal Server Error', error.toString());
  }
};
const sendMailAsync = (transporter, msg) => {
  return new Promise((resolve) => {
    transporter.sendMail(msg, (error, info) => {
      if (error) {
        resolve({ success: false, error });
      } else {
        // Check if the message was accepted by the mail server
        if (info.accepted && info.accepted.length > 0) {
          resolve({ success: true, info });
        } else {
          resolve({ success: false, error: "Message was not accepted by the mail server" });
        }
      }
    });
  });
};

async function verifyOTP({ email, enteredOTP }) {
  const storedOTP = otpStorage[email];
  console.log("storedOTP", storedOTP);
  const isVerified = enteredOTP === storedOTP;
  if (isVerified) {
    delete otpStorage[email];
  }
  return isVerified;
}



module.exports = { sendOTPEmail, verifyOTP, forgotPasswordOTP };
