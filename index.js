require('dotenv').config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

//---------------------------------------------
// Defining/configuring middle-ware
//---------------------------------------------

morgan.token('body', (request, response) => {
    const body = {
        name: request.body.name,
        number: request.body.number
    }
    return JSON.stringify(body)
}, { immediate: true })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    console.log("Invalid endpoint")
}

const errorHandling = (error, request, response, next) => {
    if (error.name == 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
}

//---------------------------------------------------
//  Using middle ware
//---------------------------------------------------
const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//---------------------------------------------
// Routing requests
//----------------------------------------------

app.get('/api/persons', (request, response, next) => {

    Person.find({}).then(people => {
        response.json(people)
    }).catch(error => next(error))

})

app.get('/api/info', (request, response, next) => {

    Person.find({}).then(people => {
        const length = people.length
        const currentTime = new Date()
        response.send(`<p>Phonebook has info for ${length} people </p> 
                        <p> ${currentTime.toString()}</p>`)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(result => {
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }

        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))

})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(result => {
        response.json(result)
    }).catch(error => {
        next(error)
    })

})

app.use(unknownEndpoint)
app.use(errorHandling)

//---------------------------------------------
//  Initiating application
//---------------------------------------------
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server started listening on port: ${PORT}`))