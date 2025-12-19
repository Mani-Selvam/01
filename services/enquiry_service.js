let func = require('../config/index');
const { ObjectId } = require('bson');
const enquirySchema = require('../models/enquiry_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const moment = require('moment');
const userSchema = require('../models/user_model');
const notificationSchema = require('../models/notification_model');
const admin = require('../config/firebase');
const path = require('path');
const fs = require('fs').promises;
const watsappMessage = require('../constant/whatsappMessenger')
const getAllEnquiry = async (req, res) => {
    try {
        const obj = {};
        if (req.query.userId) obj.enquiry_by = req.query.userId;
        if (req.query.status) obj.enquiry_status = req.query.status;
        if (req.query.followUp_by) obj.followUp_by = req.query.followUp_by;

        let findAllEnquiry = await enquirySchema.find(obj);
        if (req.query.filter) {
            if (req.query.filter === "thismonthenquiry" || req.query.filter === "thismonthsales") {
                const dateField = req.query.filter === "thismonthenquiry" ? 'enquiry_date' : 'sales_date';
                const statusFilter = req.query.filter === "thismonthsales" ? { enquiry_status: "Sales" } : {};

                findAllEnquiry = findAllEnquiry
                    .filter(enquiry => {
                        const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                        const startOfMonth = moment().startOf('month');
                        const endOfMonth = moment().endOf('month');
                        console.log("");
                        return date.isSameOrAfter(startOfMonth) && date.isSameOrBefore(endOfMonth);
                    })
                    .filter(enquiry => Object.keys(statusFilter).every(key => enquiry[key] === statusFilter[key]));
            }
        }
        if (req.query.from || req.query.to) {
            const dateField = req.query.status === "Sales" ? 'sales_date' : 'enquiry_date';
            const fromDate = req.query.from ? moment(req.query.from, 'DD-MM-YYYY') : moment().startOf('year');
            const toDate = req.query.to ? moment(req.query.to, 'DD-MM-YYYY') : moment().endOf('year');
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.isSameOrAfter(fromDate) && date.isSameOrBefore(toDate);
            });
        }

        const returnObj = {
            totalCount: findAllEnquiry.length,
            enquiry: findAllEnquiry.reverse(),
        };

        func.response.successJson['data'] = returnObj;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
};
let getEnquiryById = async (req, res) => {
    try {
        let findenquiry = await enquirySchema.findOne({ _id: req.query.id });
        if (findenquiry) {
            func.response.successJson['data'] = findenquiry;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the enquiry");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}
let createEnquiry = async (req, res) => {
    try {

        if (req.company_no) {
            const obj = {};
            obj.company_no = req.company_no;
            let findAllEnquiry = await enquirySchema.find(obj);
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                enquiry.mob_num == req.mob_num
                return enquiry
            })
            if (findAllEnquiry.length > 0) {
                return jsend(406, "Enquiry already excist with this mobile number");
            }
        }
        const latestEnquiry = await enquirySchema.findOne({ enquiry_by: req.enquiry_by }).sort({ _id: -1 }).lean();
        const nextEnquiryNo = latestEnquiry ? Number(latestEnquiry.enquiry_no.replace('ENQ_', '')) + 1 : 1;
        const enquiryNo = generateEnquiryNo(nextEnquiryNo);
        req.enquiry_no = enquiryNo;
        if (req.created_by !== req.enquiry_by) {
            req.assigned_by = "Assigned by admin"
        }
        else {
            req.assigned_by = "Self assigned"
        }
        let createNewEnquiry = new enquirySchema(req);
        createNewEnquiry = await createNewEnquiry.save();

        if (req.enquiry_image) {
            const imageBuffer = Buffer.from(req.enquiry_image, 'base64');
            const filename = `${createNewEnquiry._id}_enquiry_image.png`; // You can choose a naming convention here
            const directoryPath = 'C:/uploadfiles/enquiryimages'; // Specify the desired directory on the C: drive
            const filePath = path.join(directoryPath, filename);
            const SavedPath = 'enquiryimages/' + filename;

            // Create the directory if it doesn't exist
            await fs.mkdir(directoryPath, { recursive: true });
            // Write the image buffer to the file
            await fs.writeFile(filePath, imageBuffer);

            // Update the enquire image path in the user document
            createNewEnquiry.enquiry_image = SavedPath;
        }
        const result = await createNewEnquiry.save();

        if (createNewEnquiry.created_by !== createNewEnquiry.enquiry_by) {
            let finduser = await userSchema.findOne({ _id: createNewEnquiry.enquiry_by, is_deleted: false });

            if (finduser) {

                sendPushNotification(finduser, createNewEnquiry);


            } else {
                return jsend(406, "Failed to find the user");
            }
        }

        const message = `Greetings from Neophron Technologies!

Thank you for your interest in our web app product. We appreciate your enquiry, and one of our executives will be following up with you shortly.
        
Feel free to reach out if you have any immediate questions or need further assistance.`;

        watsappMessage(req.mob_num, message);

        func.response.successJson['data'] = createNewEnquiry;
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}
let sendPushNotification = async (user, enquiry) => {
    try {
        if (user && user.firebase_usertoken && user.firebase_usertoken.length > 0) {
            const tokens = user.firebase_usertoken;
            console.log("fcm tokens list", tokens);

            const notificationPromises = tokens.map(async (registrationToken) => {
                const message = {
                    data: {
                        enquiry_no: String(enquiry.enquiry_no),
                        enquiryId: String(enquiry._id),
                    },
                    notification: {
                        title: 'New Enquiry',
                        body: 'Enquiry ' + enquiry.enquiry_no + ' has been assigned to you'
                    },
                    token: registrationToken,
                };

                let bodyDATA = {
                    message: message,
                    read: false,
                    userId: enquiry.enquiry_by,
                };

                let createNewNotification = new notificationSchema(bodyDATA);
                createNewNotification = await createNewNotification.save();

                return admin.messaging().send(message)
                    .then((response) => {
                        console.log('Successfully sent message:', response);
                    })
                    .catch((error) => {
                        console.log('Error sending message:', error);
                        if (error.code === 'messaging/registration-token-not-registered') {
                            console.log('Catch error: Registration token not registered. Remove or update in your database.');
                        }
                    });
            });

            // Wait for all notifications to be sent
            try {
                await Promise.all(notificationPromises);
                console.log('Successfully sent notifications for enquiry:', enquiry.enquiry_no);
            } catch (error) {
                console.log('Error sending notifications:', error);
                if (error.code === 'messaging/registration-token-not-registered') {
                    console.log('All notification error: Registration token not registered. Remove or update in your database.');
                }
            }
        } else {
            console.log('User, registration token, or empty token array not found. Skipping...');
        }
    } catch (error) {
        console.error('Error:', error);
        // Assuming jsend is a function to handle JSON responses
        return jsend(500, 'Internal Server Error', error.toString());
    }
};

let updateEnquiry = async (req, res) => {
    try {
        console.log();
        let findenquiry = await enquirySchema.findOne({ _id: req._id });
        if (findenquiry) {
            _.each(Object.keys(req), (key) => {
                findenquiry[key] = req[key];
            });

            const result = await findenquiry.save();
            const updatedenquiry = await enquirySchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updatedenquiry;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the enquiry");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let deleteEnquiry = async (req, res) => {
    try {
        let findenquiry = await enquirySchema.findOne({ _id: req._id });
        if (findenquiry) {
            _.each(Object.keys(req), (key) => {
                findenquiry[key] = req[key];
            });
            const result = await findenquiry.save();
            func.response.successJson['message'] = "Successfully enquiry was deleted";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the enquiry");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

const getEnquiryCount = async (req, res) => {
    try {
        let obj = {};
        if (req.query.userId) {
            obj.enquiry_by = req.query.userId;
        }

        let findAllEnquiry = await enquirySchema.find(obj);
        if (findAllEnquiry) {
            let currentDate = new Date();
            let thisMonthEnquiryCount = 0;
            let thisMonthSalesCount = 0;
            let returnObj = {
                totalEnquires: findAllEnquiry.length,
                totalFollowups: 0,
                totalSales: 0,
                totalDropped: 0,
                totalBooked: 0
            };

            findAllEnquiry.forEach(enquiry => {
                switch (enquiry.enquiry_status) {
                    case "Followup":
                        returnObj.totalFollowups++;
                        break;
                    case "Sales":
                        returnObj.totalSales++;
                        break;
                    case "Dropped":
                        returnObj.totalDropped++;
                        break;
                    case "Booking":
                        returnObj.totalBooked++;
                        break;
                    default:
                        break;
                }
                let dateParts = enquiry.enquiry_date.split('-');
                let enquiryDate = new Date(
                    parseInt(dateParts[2]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[0])
                );
                if (
                    enquiryDate.getMonth() === currentDate.getMonth() &&
                    enquiryDate.getFullYear() === currentDate.getFullYear()
                ) {
                    thisMonthEnquiryCount++;
                }
                returnObj.thisMonthEnquiryCount = thisMonthEnquiryCount;

                if (enquiry.sales_date) {
                    console.log("sales_date____");
                    let dateParts2 = enquiry.sales_date.split('-');
                    let salesDate = new Date(
                        parseInt(dateParts2[2]),
                        parseInt(dateParts2[1]) - 1,
                        parseInt(dateParts2[0])
                    );
                    if (
                        salesDate.getMonth() === currentDate.getMonth() &&
                        salesDate.getFullYear() === currentDate.getFullYear()
                    ) {
                        thisMonthSalesCount++;
                    }
                }
                returnObj.thisMonthSalesCount = thisMonthSalesCount;
            });

            func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find the enquiry");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};

const getEnquiryCountByMonth = async (req, res) => {
    try {
        let obj = {};
        if (req.query.userId) {
            obj.enquiry_by = req.query.userId;
        }

        let findAllEnquiry = await enquirySchema.find(obj);

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const dateField = 'enquiry_date';
            const [selectedMonth, selectedYear] = req.query.month.split('-').map(part => parseInt(part, 10));
            console.log("[selectedMont1, selectedYear1]", [selectedMonth, selectedYear]);
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.month() + 1 === selectedMonth && date.year() === selectedYear;
            });

            if (findAllEnquiry) {
                let returnObj = {
                    totalEnquires: findAllEnquiry.length,
                    totalFollowups: 0,
                    totalSales: 0,
                    totalDropped: 0

                };

                findAllEnquiry.forEach(enquiry => {
                    switch (enquiry.enquiry_status) {
                        case "Followup":
                            returnObj.totalFollowups++;
                            break;
                        case "Sales":
                            returnObj.totalSales++;
                            break;
                        case "Dropped":
                            returnObj.totalDropped++;
                            break;
                        default:
                            break;
                    }

                });

                returnObj.enquiry = findAllEnquiry.reverse(),

                    func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }

        // if (findAllEnquiry) {
        //     let currentDate = new Date();
        //     let thisMonthEnquiryCount = 0;
        //     let thisMonthSalesCount = 0;
        //     let returnObj = {
        //         totalEnquires: findAllEnquiry.length,
        //         totalFollowups: 0,
        //         totalSales: 0,
        //         totalDropped: 0,
        //         totalBooked: 0
        //     };

        //     findAllEnquiry.forEach(enquiry => {
        //         switch (enquiry.enquiry_status) {
        //             case "Followup":
        //                 returnObj.totalFollowups++;
        //                 break;
        //             case "Sales":
        //                 returnObj.totalSales++;
        //                 break;
        //             case "Dropped":
        //                 returnObj.totalDropped++;
        //                 break;
        //             case "Booking":
        //                 returnObj.totalBooked++;
        //                 break;
        //             default:
        //                 break;
        //         }
        //         let dateParts = enquiry.enquiry_date.split('-');
        //         let enquiryDate = new Date(
        //             parseInt(dateParts[2]),
        //             parseInt(dateParts[1]) - 1,
        //             parseInt(dateParts[0])
        //         );
        //         if (
        //             enquiryDate.getMonth() === currentDate.getMonth() &&
        //             enquiryDate.getFullYear() === currentDate.getFullYear()
        //         ) {
        //             thisMonthEnquiryCount++;
        //         }
        //         returnObj.thisMonthEnquiryCount = thisMonthEnquiryCount;

        //         if (enquiry.sales_date) {
        //             console.log("sales_date____");
        //             let dateParts2 = enquiry.sales_date.split('-');
        //             let salesDate = new Date(
        //                 parseInt(dateParts2[2]),
        //                 parseInt(dateParts2[1]) - 1,
        //                 parseInt(dateParts2[0])
        //             );
        //             if (
        //                 salesDate.getMonth() === currentDate.getMonth() &&
        //                 salesDate.getFullYear() === currentDate.getFullYear()
        //             ) {
        //                 thisMonthSalesCount++;
        //             }
        //         }
        //         returnObj.thisMonthSalesCount = thisMonthSalesCount;
        //     });

        //     func.response.successJson['data'] = returnObj;
        //     return jsend(func.response.successJson);
        // } else {
        //     return jsend(406, "failed to find the enquiry");
        // }
    } catch (e) {
        return jsend(406, e.message);
    }
};

const getAllEnquiryByMonth = async (req, res) => {
    try {
        const obj = {};

        if (req.query.userId) obj.enquiry_by = req.query.userId;
        let findAllEnquiry = await enquirySchema.find(obj);

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const dateField = 'enquiry_date';
            const [selectedMonth, selectedYear] = req.query.month.split('-').map(part => parseInt(part, 10));
            console.log("[selectedMonth2, selectedYear2]", [selectedMonth, selectedYear]);
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.month() + 1 === selectedMonth && date.year() === selectedYear;
            });

            if (findAllEnquiry) {
                let currentDate = new Date();

                let returnObj = {
                    totalEnquires: findAllEnquiry.length,
                    totalFollowups: 0,
                    totalSales: 0,
                    totalDropped: 0

                };

                findAllEnquiry.forEach(enquiry => {
                    switch (enquiry.enquiry_status) {
                        case "Followup":
                            returnObj.totalFollowups++;
                            break;
                        case "Sales":
                            returnObj.totalSales++;
                            break;
                        case "Dropped":
                            returnObj.totalDropped++;
                            break;
                        default:
                            break;
                    }

                });

                returnObj.enquiry = findAllEnquiry.reverse(),

                    func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }
        else {
            return jsend(func.response.errorJson);
        }

    } catch (e) {
        return jsend(406, e.message);
    }
};

const getAllEnquiryByDay = async (req, res) => {
    try {
        const obj = {};

        if (req.query.userId) obj.enquiry_by = req.query.userId;
        if (req.query.day) obj.enquiry_date = req.query.day;
        let findAllEnquiry = await enquirySchema.find(obj);

        if (findAllEnquiry) {
            let currentDate = new Date();

            let returnObj = {
                totalEnquires: findAllEnquiry.length,
                totalFollowups: 0,
                totalSales: 0,
                totalDropped: 0

            };

            findAllEnquiry.forEach(enquiry => {
                switch (enquiry.enquiry_status) {
                    case "Followup":
                        returnObj.totalFollowups++;
                        break;
                    case "Sales":
                        returnObj.totalSales++;
                        break;
                    case "Dropped":
                        returnObj.totalDropped++;
                        break;
                    default:
                        break;
                }

            });

            returnObj.enquiry = findAllEnquiry.reverse(),

                func.response.successJson['data'] = returnObj;
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find the enquiry");
        }

    } catch (e) {
        return jsend(406, e.message);
    }
};

const getAllSalesByMonth = async (req, res) => {
    try {
        const obj = {};


        if (req.query.userId) obj.enquiry_by = req.query.userId;
        let findAllEnquiry = await enquirySchema.find(obj);

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const dateField = 'followUp_date';
            const [selectedMonth, selectedYear] = req.query.month.split('-').map(part => parseInt(part, 10));
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.month()+1 === selectedMonth && date.year() === selectedYear;
            });

            if (findAllEnquiry) {
                let returnObj = {
                    totalSales: findAllEnquiry.length,
                };
                returnObj.sales = findAllEnquiry.reverse(),
                    func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }
        else {
            return jsend(func.response.errorJson);
        }

    } catch (e) {
        return jsend(406, e.message);
    }
};
const getAllSalesAmountByMonth = async (req, res) => {
    try {
        const obj = {};
        if (req.query.userId) obj.enquiry_by = req.query.userId;
        obj.enquiry_status = "Sales"
        let findAllEnquiry = await enquirySchema.find(obj);

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const dateField = 'sales_date';
            const [selectedMonth, selectedYear] = req.query.month.split('-').map(part => parseInt(part, 10));
            console.log("[selectedMonth4, selectedYear4]", [selectedMonth, selectedYear]);
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.month() + 1 === selectedMonth && date.year() === selectedYear;
            });

            if (findAllEnquiry) {
                let validEnquiries = findAllEnquiry.filter(enquiry => {
                    return !isNaN(enquiry.aprox_product_cost) && enquiry.aprox_product_cost !== "";
                });
                console.log("validEnquiriesssssss", validEnquiries);
                let totalAproxProductCost = validEnquiries.reduce((total, sale) => total + parseFloat(sale.aprox_product_cost), 0);

                totalAproxProductCost = parseFloat(totalAproxProductCost.toFixed(2));

                let totalAproxProductCostString = totalAproxProductCost.toString();

                let returnObj = {
                    totalSales: validEnquiries.length,
                };

                if (!totalAproxProductCostString || isNaN(totalAproxProductCostString)) {
                    totalAproxProductCostString = "0";
                }

                returnObj.salesAmount = totalAproxProductCostString;

                func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }
        else {
            if (findAllEnquiry) {
                let validEnquiries = findAllEnquiry.filter(enquiry => {
                    return !isNaN(enquiry.aprox_product_cost) && enquiry.aprox_product_cost !== "";
                });
                console.log("validEnquiriesssssss", validEnquiries);
                let totalAproxProductCost = validEnquiries.reduce((total, sale) => total + parseFloat(sale.aprox_product_cost), 0);

                totalAproxProductCost = parseFloat(totalAproxProductCost.toFixed(2));

                let totalAproxProductCostString = totalAproxProductCost.toString();

                let returnObj = {
                    totalSales: validEnquiries.length,
                };

                if (!totalAproxProductCostString || isNaN(totalAproxProductCostString)) {
                    totalAproxProductCostString = "0";
                }

                returnObj.salesAmount = totalAproxProductCostString;

                func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }
        // else{
        //     return jsend(func.response.errorJson);
        // }

    } catch (e) {
        return jsend(406, e.message);
    }
};
const getAllDroppedByMonth = async (req, res) => {
    try {
        const obj = {};
        if (req.query.userId) obj.enquiry_by = req.query.userId;
        let findAllEnquiry = await enquirySchema.find(obj);

        if (req.query.month && isValidMonthAndYear(req.query.month)) {
            const dateField = 'dropped_date';
            const [selectedMonth, selectedYear] = req.query.month.split('-').map(part => parseInt(part, 10));
            console.log("[selectedMonth5, selectedYear5]", [selectedMonth, selectedYear]);
            findAllEnquiry = findAllEnquiry.filter(enquiry => {
                const date = moment(enquiry[dateField], 'DD-MM-YYYY');
                return date.month() + 1 === selectedMonth && date.year() === selectedYear;
            });

            if (findAllEnquiry) {
                let returnObj = {
                    totalDropped: findAllEnquiry.length,
                };
                returnObj.dropped = findAllEnquiry.reverse(),
                    func.response.successJson['data'] = returnObj;
                return jsend(func.response.successJson);
            } else {
                return jsend(406, "failed to find the enquiry");
            }

        }
        else {
            return jsend(func.response.errorJson);
        }

    } catch (e) {
        return jsend(406, e.message);
    }
};
// Helper function to check if the provided month and year are valid
function isValidMonthAndYear(monthAndYear) {
    const [month, year] = monthAndYear.split('-').map(part => parseInt(part, 10));
    return !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12;
}

function generateEnquiryNo(nextEnquiryNo) {
    return `ENQ_${nextEnquiryNo}`;
}

module.exports = {
    getAllEnquiry, createEnquiry, updateEnquiry, deleteEnquiry, getEnquiryById, getEnquiryCount, getAllSalesByMonth
    , getAllEnquiryByMonth, getAllEnquiryByDay, getAllDroppedByMonth, getAllSalesAmountByMonth, getEnquiryCountByMonth
};