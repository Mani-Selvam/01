const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let notificationSchema = new mongoose.Schema({
    message: { type:Object , required: true },
    read: { type: Boolean, required: true },
    userId: { type: String, required: true },
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('notification', notificationSchema)