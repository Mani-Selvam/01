const mongoose = require('mongoose')

let leadSourceSchema = new mongoose.Schema({
    leadName: { type:String , required: false },
    userId:{type: String, required: true },
    is_deleted:{type: Boolean, default: false}
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('lead_source', leadSourceSchema)