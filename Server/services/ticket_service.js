let func = require('../config/index');
const { ObjectId } = require('bson');
const ticketSchema = require('../models/ticket_model');
const versionSchema = require('../models/version_model');
const jsend = require('../constant/jsend')
const _ = require('lodash');
const bcrypt = require("bcrypt");
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');


const getAllTicket = async (req, res) => {
    try {
        let obj = {};
        if (req.query.raised_by) {
            obj.raised_by = req.query.raised_by
        }
        let findAllTicket = await ticketSchema.find(obj);
        if (findAllTicket) {
            let modifiedTickets = findAllTicket.map(ticket => {
                const { original_password, ...ticketWithoutPassword } = ticket.toObject();
                return ticketWithoutPassword;
            });
            let returnObj = {};
            returnObj.totalCount = modifiedTickets.length;
            returnObj.tickets = modifiedTickets.reverse();
            func.response.successJson['data'] = returnObj;
            func.response.successJson['message'] = "Successfully found ticket list";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "failed to find all the tickets");
        }
    } catch (e) {
        return jsend(406, e.message);
    }
};

let getTicketById = async (req, res) => {
    try {
        let findticket = await ticketSchema.findOne({ _id: req.query.id });
        if (findticket) {
            func.response.successJson['data'] = findticket;
            func.response.successJson['message'] = "Successfully ticket was found";
            return jsend(func.response.successJson);
        } else {
            return jsend(406, "Failed to find the ticket");
        }
    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

let createTicket = async (req, res) => {
    try {
    
        if (!req.body.ticket_no) {
            const latestTicketNo = await ticketSchema.findOne({raised_by:req.body.raised_by}).sort({ _id: -1 }).lean();
            console.log("latestTicketNo",latestTicketNo);
            const nextTicketNo = latestTicketNo ? Number(latestTicketNo.ticket_no.replace('TKT_', '')) + 1 : 1;
            const ticketNo = generateTicketNo(nextTicketNo);
            req.body.ticket_no = ticketNo;
        }

        let createNewTicket = new ticketSchema(req.body);
        createNewTicket = await createNewTicket.save();

        if (createNewTicket.ticket_image) {
            const imageBuffer = Buffer.from(createNewTicket.ticket_image, 'base64');
            const filename = `${createNewTicket._id}_ticket.png`; // You can choose a naming convention here
            const directoryPath = 'C:/uploadfiles/ticketimages'; // Specify the desired directory on the C: drive
            const filePath = path.join(directoryPath, filename);
            const SavedPath = 'ticketimages/' + filename;

            // Create the directory if it doesn't exist
            await fs.mkdir(directoryPath, { recursive: true });

            // Write the image buffer to the file
            await fs.writeFile(filePath, imageBuffer);

            createNewTicket.ticket_image = SavedPath;
            const result = await createNewTicket.save();
        }
        func.response.successJson['data'] = createNewTicket;
        func.response.successJson['message'] = "Successfully ticket was Created";
        return jsend(func.response.successJson);
    } catch (e) {
        return jsend(406, e.message);
    }
}

let updateTicket = async (req, res) => {
    try {

        let findticket = await ticketSchema.findOne({ _id: req._id });
        if (findticket) {
            console.log("updateTicket findticket",findticket);
            _.each(Object.keys(req), (key) => {
                findticket[key] = req[key];
            });

            const result = await findticket.save();
            const updatedticket = await ticketSchema.findOne({ _id: req._id });
            func.response.successJson['data'] = updatedticket;
            func.response.successJson['message'] = "Successfully ticket was Updated";
            console.log("Successfully ticket was Updated");
            return jsend(func.response.successJson);
        } else {
            console.log("Failed to find the ticket")
            return jsend(406, "Failed to find the ticket");
        }
    } catch (e) {
        console.error("e.message",e.message);
        return jsend(406, e.message);
    }
}

let deleteTicket = async (req, res) => {
    try {
        let findticket = await notificationSchema.findByIdAndDelete(req._id);
        if (findticket) {
            return res.status(200).json({ message: "Successfully deleted ticket" });
        } else {
            return res.status(404).json({ error: "ticket not found" });
        }

    } catch (e) {
        console.log(e);
        return jsend(406, e.message);
    }
}

function generateTicketNo(nextTicketNo) {
    return `TKT_${nextTicketNo}`;
}

module.exports = { getAllTicket, createTicket, updateTicket, deleteTicket, getTicketById };