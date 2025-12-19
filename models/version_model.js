const mongoose = require('mongoose')
const { ObjectId } = require('bson')

let versionSchema = new mongoose.Schema({
    current_version :{
        type: String,
        require:true
    }
},
{
    timestamps: true,
}
)
module.exports = mongoose.model('appversion', versionSchema)