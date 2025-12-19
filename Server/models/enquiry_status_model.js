const mongoose = require('mongoose')

let enquiryStatusSchema = new mongoose.Schema({
    enquiryStatus: { type:String , required: false },
    userId:{type: String, required: true },
    is_deleted:{type: Boolean, default: false}
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('enquiry_status', enquiryStatusSchema)