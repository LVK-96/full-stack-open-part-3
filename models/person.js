const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI
mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true
    },
    number: {
        type: String,
        validate: {
            validator: number => {
                const no_whitespace = number.replace(/\s/g, '')
                return /^[0-9]*$/.test(no_whitespace)
            },
            message: number => `${number.value} is not a numeric string`
        },
        minlength: 8
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
