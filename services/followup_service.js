let func = require('../config/index');
const { ObjectId } = require('bson');
const followUpSchema = require('../models/followUp_model');
const enquirySchema = require('../models/enquiry_model');
const userSchema = require('../models/user_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const moment = require('moment');

 const getAllFollowUp = async (req,res) => {

    try {
        let obj = {};
        obj.enquiry_status = 'Followup'
        if(req.query.userId){
            obj.enquiry_by = req.query.userId
          }
        let findfollowUp = await enquirySchema.find(obj);
        if (findfollowUp) {
            let returnObj = {};
            returnObj.totalCount = findfollowUp.length
            returnObj.enquiry = findfollowUp.reverse()
            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
 
};

let getFollowUpById = async (req, res) => {
    try {
        console.log("................................foundone");
        let findfollowUp = await enquirySchema.findOne({ _id: req.query.id });
        if (findfollowUp) {
            func.response.successJson['data'] = findfollowUp;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}


let getFollowUpHistory = async (req, res) => {
    try {
        let obj = {};
        if( req.query.id){
            obj.enquiry_id= req.query.id
        }
        if( req.query.status){
            obj.enquiry_status= req.query.status
        }
        if( req.query.followUp_by){
            obj.followUp_by= req.query.followUp_by
        }
       // obj.enquiry_status = 'Followup'    
       let findAllFollowUp = await followUpSchema.aggregate([
           { "$match": obj },
           {
               $lookup: {
                   from: 'users',
                   localField: 'followUp_by',
                   foreignField: 'userId',
                   as: 'userDetails'
               },
           },

           {
               $addFields: {
                   followUp_by_name: { $arrayElemAt: ["$userDetails.user_name", 0] }, // Assuming name is a field in the 'users' collection
               }
           },
           {
               $project: {
                   _id: 1,
                   followUp_date: 1,
                   next_followUp_date: 1,
                   remarks: 1,
                   enquiry_status: 1,
                   enquiry_no: 1,
                   enquiry_id: 1,
                   customer_name: 1,
                   mob_num: 1,
                   followUp_by: 1,
                   createdAt: 1,
                   updatedAt: 1,
                   followUp_no: 1,
                   followUp_by_name: 1,
                   sales_date: 1,
                   dropped_date: 1,
               }
           }
       ]);
       if (findAllFollowUp) {
           let returnObj = {};
           returnObj.totalCount = findAllFollowUp.length
           returnObj.Followup = findAllFollowUp.reverse()
           func.response.successJson['data'] = returnObj;
           return jsend(func.response.successJson);
       } else {
           return jsend(400, "Failed to fetch the followUp")
       }

   } catch (e) {
       return jsend(406, e.message);
   }  
}

let createFollowUp = async (req, res) => {
    try {
        const latestFollowUp = await followUpSchema.findOne().sort({ followUp_no: -1 }).limit(1);
        const nextFollowUpNo = latestFollowUp
        ? Number(latestFollowUp.followUp_no.replace('FU_', '')) + 1: 1;;

        const followUpNo = generateFollowUpNo(nextFollowUpNo);
        req.followUp_no = followUpNo;
        let createNewFollowUp = new followUpSchema(req);
        createNewFollowUp = await createNewFollowUp.save();
        func.response.successJson['data'] = createNewFollowUp;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateFollowUp = async (req, res) => {
    try {
        let findfollowUp = await followUpSchema.findOne({ _id: req._id });
        if (findfollowUp) {
            _.each(Object.keys(req), (key) => {
                findfollowUp[key] = req[key];
            });
            const result = await findfollowUp.save();
            const updatedfollowUp = await followUpSchema.findOne({ _id: req._id  });
            func.response.successJson['data'] = updatedfollowUp;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let deleteFollowUp = async (req, res) => {
    try {
        let findfollowUp = await followUpSchema.findOne({ _id: req._id });
        if (findfollowUp) {
            _.each(Object.keys(req), (key) => {
                findfollowUp[key] = req[key];
            });
            const result = await findfollowUp.save();
            func.response.successJson['message'] = "Successfully followUp was deleted";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}


const getAllFollowUpByDay = async (req, res) => {
    try {
        let obj = {};
        obj.enquiry_status = 'Followup';

        if (req.query.userId) {
            obj.enquiry_by = req.query.userId;
        }

        let findfollowUp = await enquirySchema.find(obj);

        if (findfollowUp) {
            const requestedDate = moment(req.query.day, 'DD-MM-YYYY');
            const startOfDay = requestedDate.startOf('day');
            const endOfDay = requestedDate.endOf('day');


            findfollowUp = findfollowUp.filter(enquiry => {
                const nextFollowUpDate = enquiry['next_followUp_date'] ? moment(enquiry['next_followUp_date'], 'DD-MM-YYYY HH:mm') : null;
                const followUpDate = moment(enquiry['followUp_date'], 'DD-MM-YYYY HH:mm'); 
                
                const nextFollowUpDateWithoutTime = nextFollowUpDate ? moment(nextFollowUpDate).startOf('day') : null;
                const followUpDateWithoutTime = moment(followUpDate).startOf('day'); 
            
                if (nextFollowUpDate) {
                    return nextFollowUpDateWithoutTime.isSame(requestedDate, 'day');
                } else {
                    return followUpDateWithoutTime.isSame(requestedDate, 'day');
                }
            });

            let returnObj = {
                totalCount: findfollowUp.length,
                enquiry: findfollowUp.reverse(),
            };

            func.response.successJson.data = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
};

const getAllFollowUpByDayFilter = async (req, res) => {
    try {
        let obj = {};
        if (req.query.userId) {
            obj.followUp_by = req.query.userId;
        }

        let findfollowUp = await followUpSchema.find(obj);

        if (findfollowUp) {
            const requestedDate = moment(req.query.day, 'DD-MM-YYYY');
            const startOfDay = requestedDate.startOf('day');
            const endOfDay = requestedDate.endOf('day');

            findfollowUp = findfollowUp.filter(enquiry => {
                const nextFollowUpDate = moment(enquiry['next_followUp_date'], 'DD-MM-YYYY HH:mm');
                const followUpDate = moment(enquiry['followUp_date'], 'DD-MM-YYYY HH:mm'); 
            
                const nextFollowUpDateWithoutTime = moment(nextFollowUpDate).startOf('day');
                const followUpDateWithoutTime = moment(followUpDate).startOf('day'); 

                return nextFollowUpDateWithoutTime.isSame(requestedDate, 'day') || followUpDateWithoutTime.isSame(requestedDate, 'day');
            });

            const enquiryIds = findfollowUp.map(enquiry => enquiry.enquiry_id);

            // Query enquirySchema to get corresponding data for each enquiry_id
            const enquiryData = await enquirySchema.find({ _id: { $in: enquiryIds } });

            let returnObj = {
                totalCount: findfollowUp.length,
                enquiry: findfollowUp.reverse(),
                enquiryData: enquiryData // Add this line to include enquiry data
            };

            func.response.successJson.data = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the followUp");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
};
function generateFollowUpNo(nextFollowUpNo) {
    return `FU_${nextFollowUpNo}`;
}

const getAllmissedfollowups = async (req, res) => {
    try {
        const obj = {};
        var totalcount = ""
        if (req.query.userId) obj.enquiry_by = req.query.userId;
        obj.enquiry_status = "Followup";
        let findAllEnquiry = await enquirySchema.find(obj);
        if (findAllEnquiry) {
            const CurrentDate = moment().startOf('day'); // Current date without time

 
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                let followUpDate;
                if (enquiry.next_followUp_date && moment(enquiry.next_followUp_date, 'DD-MM-YYYY HH:mm').isValid()) {
                    followUpDate = moment(enquiry.next_followUp_date, 'DD-MM-YYYY HH:mm');
                } else {
                    followUpDate = moment(enquiry.followUp_date, 'DD-MM-YYYY HH:mm');
                }

                // Exclude today's date and future dates
                return followUpDate.isBefore(CurrentDate, 'day');
            });
            totalcount = findAllEnquiry.length
        }

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const requestedDate = moment(req.query.month, 'MM-YYYY');
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                let followUpDate1;
                if (enquiry.next_followUp_date && moment(enquiry.next_followUp_date, 'DD-MM-YYYY HH:mm').isValid()) {
                    followUpDate1 = moment(enquiry.next_followUp_date, 'DD-MM-YYYY HH:mm');
                } else {
                    followUpDate1 = moment(enquiry.followUp_date, 'DD-MM-YYYY HH:mm');
                }

                return followUpDate1.isSame(requestedDate, 'month');
            });



                let returnObj = {
                    totalcount:totalcount,
                    enquiry: findAllEnquiry.reverse(),
                };

                func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            // } else {
            //     return jsend(406, "Failed to find the enquiries for the specified month.");
            // }

        } else {
            return jsend(400, "Invalid month format. Please use MM-YYYY format.");
        }

    } catch (e) {
        return jsend(500, e.message);
    }
};

function isValidMonthAndYear(monthAndYear) {
    const [month, year] = monthAndYear.split('-').map(part => parseInt(part, 10));
    return !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12;
}
module.exports = { getAllFollowUpByDayFilter, getAllFollowUp,createFollowUp,getFollowUpHistory, updateFollowUp,deleteFollowUp,getFollowUpById ,getAllFollowUpByDay,getAllmissedfollowups};