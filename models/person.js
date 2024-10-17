const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url, { connectTimeoutMS: 30000 }).then(response => {
    console.log("connected to mongoDB")
})
    .catch(error => {
        console.log("connection to mongoDB failed")
    })
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: [3, 'should have at least 3 characters'],
            required: [true, 'is required']
        },
        number: {
            type: String,
            minLength: [8, 'should have min length of 8'],
            required: [true, 'is required'],
            match: [/^\d{2,3}-\d{5,}$/, 'is not in proper format']
        }
    }
)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personSchema)