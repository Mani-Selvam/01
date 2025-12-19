const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let enquirySchema = new mongoose.Schema({
    enquiry_no: { type:String , required: true },
    enquiry_type: { type: String,enum: ['Hot', 'Cold', 'Warm'], required: true },
    lead_source: { type: String, required: true },
    customer_name: { type: String, required: true },
    address: { type: String, required: false },
    mob_num: { type: Number, required: true },
    alt_mob_num: { type: Number, required: false },

    product_name: { type: String, required: true },
    product_variant_color: { type: String, required: false },
    aprox_product_cost: { type: String, required: false },
    payment_method: { type: String, required: false },
    enquiry_date: { type: String, required: false },
    enquiry_by: { type: String, required: true }, //assigned to
    enquiry_by_username:{ type: String, required: true},
    created_by: { type: String, required: false },
    enquiry_status: { type: String, enum: ['Followup', 'Dropped', 'Booking', 'Sales'], required: true },
    assigned_by : { type: String, required: false },

    sales_date: { type: String, required: false },
    dropped_date: { type: String, required: false },
 // for followUp
    followUp_date: { type: String, required: false }, 
    next_followUp_date: { type: String, required: false },
    remarks:  { type: String, required: false },
    followUp_by: { type: String, required: false },
    enquiry_image : {type: String, required: false},
    location : {type: String, required: false},
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },

    company_no: { type: String, required: false },

},
{
    timestamps: true,
}
)
module.exports = mongoose.model('enquiry', enquirySchema)