const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let orderSchema = new mongoose.Schema({
    razorpay_order_id :{type: String, required: false },
    razorpay_order_details :{type: Object, required: false },
    userId:{type: String, required: true },
    company_no:{type: String, required: false },
    amount:{ type: Number,required: true},
    payment_type:{type: String, required: true },
    planId:{type: String, required: true },
    validity:{type: Date, required: false },
    status:{type: String, default: "Unpaid" },
    Active:{type: Boolean, default: false },
    couponName:{type: String, required: false},
    planDetails:{type: Object, required: false },
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('order', orderSchema)