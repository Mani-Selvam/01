const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let planSchema = new mongoose.Schema({
    planName :{type: String, required: true },
    gstPercentage: { type: Number, default: 18 },
    price:{ type: Number,required: true},
    noOfUser:{ type: Number, default: 1 ,required: true},
    validity:{type: String, required: true },
    totalPrice:{ type: Number,required: false},
    is_deleted:{type: Boolean, default: false}
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('plan', planSchema)