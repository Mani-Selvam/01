const mongoose = require('mongoose')

let aboutContentSchema = new mongoose.Schema({
    aboutContent: {type: String, require: true
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('about',aboutContentSchema)