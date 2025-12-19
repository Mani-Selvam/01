const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let ticketSchema = new mongoose.Schema({
    ticket_title :{type: String, required: true },
    description :{type: String, required: true },
    response :{type: String, required: false },
    ticket_image :{type: String, required: true },
    ticket_status: { type: String, enum: ['Open','Inprogress','Closed'], required: true },
    raised_date :{type: String, required: true },
    raised_by :{type: String, required: true },
    ticket_no:{type: String, required: false }
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('ticket', ticketSchema)