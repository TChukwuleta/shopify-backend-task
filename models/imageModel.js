const mongoose = require('mongoose')
const schema = mongoose.Schema

const imageSchema = new schema({
    name: {
        type: String
    },
    img: {
        data: Buffer,
        contentType: String
    }
})

const Image = mongoose.model('image', imageSchema)
module.exports = Image