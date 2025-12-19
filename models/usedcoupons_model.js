const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let usedcouponSchema = new mongoose.Schema({
    couponName :{type: String, required: true },
    userId:{type: String, required: true },
    coupon_id:{type: String, required: true },
    is_deleted:{type: Boolean, default: false}
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('coupon', usedcouponSchema)