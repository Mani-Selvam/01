const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let followUpSchema = new mongoose.Schema({
    followUp_no: { type:String , required: false },
    followUp_date: { type: String, required: true },
    next_followUp_date: { type: String, required: false },
    remarks: { type: String, required: true },
    enquiry_status: { type: String,enum: ['Followup', 'Dropped', 'Booking', 'Sales'], required: true },
    enquiry_no: { type: String, required: false },
    enquiry_id: { type: String, required: false },
    customer_name: { type: String, required: true },
    mob_num: { type: Number, required: true },
    followUp_by: { type: String, required: false },
    sales_date: { type: String, required: false },
    dropped_date: { type: String, required: false },
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('follow_up', followUpSchema)