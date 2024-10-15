const express = require("express")
const morgan = require("morgan")
const cors = require("cors")


// Defining custom middle-ware-----------------------------------

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
    console.log("Invalid endpoint")
}

morgan.token('body', (request, response) => {
    const body = {
        name: request.body.name,
        number: request.body.number
    }
    return JSON.stringify(body)
}, { immediate: true })

// Defining helper functions--------------------------------------

const generateID = () => {
    const id = Math.round(Math.random() * 1000)
    return String(id)
}

// Declaring data related stuff-----------------------------------
let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

//  Using middle ware to parse json and log requests--------------
const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Routing functions----------------------------------------------

app.get('/api/persons', (request, response) => {
    response.json(persons)
    console.log("get request for all resources served")
    // console.log(response)
})

app.get('/api/info', (request, response) => {
    const length = persons.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info for ${length} people </p> 
        <p> ${currentTime.toString()}</p>`)
    console.log("get request for api info served")
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    const record = persons.find(person => person.id === String(id))
    console.log(record)
    if (!record) {
        response.status(404).end()
        console.log(`requested record with id ${id} not in the database`)
    } else {
        response.json(record)
        // console.log(response)
        console.log(`requested record provided`)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
    console.log(`Deleted record id: ${id}`)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const isPresent = persons.find(person => person.name === body.name)
    //console.log(isPresent)
    if ((!body.name) || (!body.number)) {
        response.status(400).json({
            error: 'name and number are compulsory field'
        })
        console.log("error: name or number not provided")
    } else if (isPresent) {
        response.status(400).json({
            error: 'name must be unique'
        })
        console.log("error: name not unique")
    } else {
        body.id = generateID()
        persons = persons.concat(body)
        response.json(body)
        console.log("record added")
    }

})

app.use(unknownEndpoint)

//  Initiating application-------------------------------------------
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server started listening on port: ${PORT}`))