let func = require('../config/index');
const { ObjectId } = require('bson');
const userSchema = require('../models/user_model');
const versionSchema = require('../models/version_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const orderSchema = require('../models/order_model');
const planSchema = require('../models/plan_model');
cron.schedule('* * * * *', async () => {
    try {
        console.log("Finding user with freeTrail in background");
        findFreetailUsers()

    } catch (error) {
        console.error("Error in cron job:", error);
    }
});

let findFreetailUsers = async () => {
    try {
        const usersWithFreeTrail = await userSchema.find({ freeTrail: true, is_deleted: false });
        for (let user of usersWithFreeTrail) {
            const createdAtDate = new Date(user.createdAt);
            const currentDate = new Date();
            const timeDifference = currentDate.getTime() - createdAtDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);
            if (daysDifference > 7) {
                console.error("daysDifferen2:", daysDifference);
                user.freeTrail = false;
                const result = await user.save();
                //    console.log('Updated user:', user);
            }
            else{
                user.freeTrail = true;
                const result = await user.save();
            }

        }
        return usersWithFreeTrail;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
// const getAllUser = async (req, res) => {
//     try {
//         let obj = {};
//         if (req.query.companyno) {
//             obj.company_no = req.query.companyno
//         }
//         obj.is_deleted = false;
//         let findAllUser = await userSchema.find(obj);
//         if (findAllUser) {
//             let modifiedUsers = findAllUser.map(user => {
//                 const { original_password, ...userWithoutPassword } = user.toObject();
//                 return userWithoutPassword;
//             });
//             let returnObj = {};
//             returnObj.totalCount = modifiedUsers.length;
//             returnObj.users = modifiedUsers.reverse();
//             func.response.successJson['data'] = returnObj;
//             func.response.successJson['message'] = "Successfully foun user list";
//             return jsend(func.response.successJson);
//         } else {
//             return jsend(406, "failed to find all the users");
//         }
//     } catch (e) {
//         return jsend(406, e.message);
//     }
// };


const getAllUser = async (req, res) => {
    try {
        let obj = {};
        if (req.query.companyno) {
            obj.company_no = req.query.companyno;
        }
        obj.is_deleted = false;

        let users = await userSchema.find(obj);
        let orderIds = users.map(user => user.orderId);
        orderIds = [...new Set(orderIds)]; // Get unique orderIds

        // Fetch order details for all orderIds
        let orderDetails = await orderSchema.find({ _id: { $in: orderIds } });

        // Create a map of order details by orderId for quick lookup
        let orderDetailsMap = {};
        orderDetails.forEach(order => {
            orderDetailsMap[order._id.toString()] = order;
        });

        // Fetch plan details for each order and update orderDetailsMap
        await Promise.all(orderDetails.map(async (order) => {
            const planDetails = await planSchema.findOne({ _id: order.planId });
            if (planDetails) {
                orderDetailsMap[order._id.toString()].planDetails = planDetails;
            }
        }));

        // Populate orderDetails field in each user document
        let usersWithOrderDetails = users.map(user => {
            let orderDetail = orderDetailsMap[user.orderId];
            return {
                ...user.toObject(),
                orderDetails: orderDetail || {} // Assign order details or empty object
            };
        });

        let returnObj = {};
        returnObj.totalCount = usersWithOrderDetails.length;
        returnObj.users = usersWithOrderDetails;
        func.response.successJson['data'] = returnObj;
        func.response.successJson['message'] = "Successfully found user list with order details";
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
};

let getUserById = async (req, res) => {
    try {
        let finduser = await userSchema.findOne({ _id: req.query.id, is_deleted: false });
        if (finduser) {
            func.response.successJson['data'] = finduser;
            func.response.successJson['message'] = "Successfully user was found";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the user");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createUser = async (req, res) => {
    try {
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
        if (findParticular) {
            if (findParticular.emailId === req.body.emailId) {
                return jsend(200, "Email already exists");
            } else if (findParticular.mobile_no === req.body.mobile_no) {
                return jsend(200, "Mobile already exists");
            }
        }
        if (!req.body.company_no) {
       // const latestEntry = await userSchema.findOne().sort({ _id: -1 }).lean();
        const latestEntry = await userSchema.findOne({ user_type: 'Admin' }).sort({ _id: -1 }).lean(); 
        const nextCompanyNo = latestEntry ? Number(latestEntry.company_no) + 1 : 1;
        req.body.company_no = nextCompanyNo.toString();
        }
        const latestEntry = await userSchema.findOne().sort({ _id: -1 }).lean();
        const nextEntryNo = latestEntry ? Number(latestEntry.userId) + 1 : 1;


        req.body.userId = nextEntryNo.toPrecision();
        req.body.original_password = req.body.password
        req.body.password = bcrypt.hashSync(req.body?.password, 10);
        req.body.status = "Active"
        let createNewUser = new userSchema(req.body);
        createNewUser = await createNewUser.save();
        func.response.successJson['data'] = createNewUser;
        func.response.successJson['message'] = "Successfully user was Created";
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateUser = async (req, res) => {
    try {

        let finduser = await userSchema.findOne({ _id: req._id, is_deleted: false });
        if (finduser) {
            console.log("updateUser finduser",finduser);
            if (req.password){
                if (req.password !== finduser.password) {
                    req.original_password = req.password
                    req.password = bcrypt.hashSync(req?.password, 10);
                }
            }
            _.each(Object.keys(req), (key) => {
                finduser[key] = req[key];
            });
            console.log("updateUser reqqqqqqqqqqqqqqq",req);
           if(req.status){
            if (req.status !== "Active") {
                finduser.havePlan = false
            }
           }
         
            if (req.profile_image) {
                const imageBuffer = Buffer.from(req.profile_image, 'base64');
                const filename = `${finduser._id}_profile_image.png`; // You can choose a naming convention here
                const directoryPath = 'C:/uploadfiles/profileimages'; // Specify the desired directory on the C: drive
                const filePath = path.join(directoryPath, filename);
                const SavedPath = 'profileimages/' + filename;

                // Create the directory if it doesn't exist
                await fs.mkdir(directoryPath, { recursive: true });

                // Write the image buffer to the file
                await fs.writeFile(filePath, imageBuffer);

                // Update the profile image path in the user document
                finduser.profile_image = SavedPath;
            }

            const result = await finduser.save();
            const updateduser = await userSchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updateduser;
            func.response.successJson['message'] = "Successfully user was Updated";
            console.log("Successfully user was Updated");
            return jsend(func.response.successJson);
        } else {
            console.log("Failed to find the user")
            return jsend(406, "Failed to find the user");
        }
    } catch (e) {
        console.error("e.message",e.message);
        return jsend(406, e.message);
    }
}

let deleteUser = async (req, res) => {
    try {
        let finduser = await userSchema.findOne({ _id: req.id });
        if (finduser) {
            finduser.is_deleted = true;
            await finduser.save();
            func.response.successJson['message'] = "Successfully user was deleted";
            func.response.successJson['data'] = finduser
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the user");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}
let updateappversion = async (req, res) => {
    try {
        if(req._id){
            let findParticular = await versionSchema.findOne({ _id: req._id  });
            if (findParticular) {
                _.each(Object.keys(req), (key) => {
                    findParticular[key] = req[key];
                });
    
                const result = await findParticular.save();
                const updatedplan = await versionSchema.findOne({ _id: req._id });
                func.response.successJson['data'] = updatedplan;
                return jsend(func.response.successJson);
            }
        }
        else{
            let createNewVersion = new versionSchema(req);
            createNewVersion = await createNewVersion.save();
            func.response.successJson['data'] = createNewVersion;
            func.response.successJson['message'] = "Successfully current version was Created";
            return jsend(func.response.successJson);
        }

    } catch (e) {
        return jsend(406, e.message);
    }
    
}

const getcurrentversion = async (req, res) => {
    try {
        let obj = {};
        let findversion = await versionSchema.findOne(obj);
        if (findversion) {
            func.response.successJson['data'] = findversion;
            func.response.successJson['message'] = "Successfully version was found";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the user");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
};


module.exports = { getAllUser, createUser, updateUser, deleteUser, getUserById ,updateappversion,getcurrentversion};