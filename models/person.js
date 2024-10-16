const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url).then(response => {
    console.log("connected to mongoDB")
})
    .catch(error => {
        console.log("connection to mongoDB failed")
    })
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String
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