const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let couponSchema = new mongoose.Schema({
    couponName :{type: String, required: true },
    from: { type: String,required: true },
    to:{ type: String,required: true},
    discountAmount:{ type: Number,required: false},
    discountPercentage:{ type: Number,required: false},
    discountType:{ type: String,required: false},
    is_deleted:{type: Boolean, default: false}
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('coupon', couponSchema)