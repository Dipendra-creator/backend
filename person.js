let date_ob = new Date();

// Third Party Dependencies
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

//Middlewares
app.use(cors())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))
app.use(express.json());

// Environmental Variables
require('dotenv').config()

// Internal Dependencies
const Person = require('./prsn')


morgan.token('ob', function (req) {
    return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :response-time :req[header] :ob'))

/* Add a new person */
app.post('/api/persons', (request, response, next) => {
    let person = new Person({
        name: request.body.name,
        number: request.body.number,
    })

    person.save().then(result => {
        response.json(result)
    }).catch(error => next(error))
})

/* Update an existing person */
app.put('/api/persons/:id', (req, res, next) => {
    const updatedPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true }).then(result => {
        res.json(result)
    }).catch(error => next(error))
})

/* Status page */
app.get('/info', (req, res, next) => {
    Person.countDocuments({}).then(count => {
        let info = `<p>Phonebook has info for ${count} people</p>`
        info += new Date()
        res.send(info)
    }).catch(error => next(error))
})

/* List all people */
app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(phonebook => {
        response.json(phonebook.map(person => person.toJSON()))
    }).catch(error => next(error))
})

/* List a specific person by ID */
app.get('/api/notes/:id', (request, response, next) => {
    Person.findById(request.params.id).then(result => {
        if (result) {
            response.json(result)
        }
        else {
            response.status(404).end()
        }
    }).catch(error => next(error))
    })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

/* Error Handler */
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'Malformed ID' })
    }
    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})