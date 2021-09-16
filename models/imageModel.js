const mongoose = require('mongoose')
const schema = mongoose.Schema

const imageSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'userprofile'
    },
    name: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    }
}, {
    timestamps: true
})

const Image = mongoose.model('image', imageSchema)
module.exports = Image