const express = require('express')
const app = express()
let date_ob = new Date();
app.use(express.json());
var morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}

// create custom message in the middlewares
morgan.token('ob', function (req) {
    return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :response-time :req[header] :ob'))

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    let person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    if (persons.some(person => person.name === body.name)){
        console.log('name must be unique')
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if (persons.some(person => person.number === body.number)){
        console.log('number must be unique')
        return response.status(400).json({
            error: 'number must be unique'
        })
    }
    console.log("AFTER: ",person);

    persons = persons.concat(person)
    //
    response.json(person)
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
app.get('/info', (request, response) =>{
    response.send("<h3>PhoneBook has Info of "+ persons.length +" peoples</h3> <h3>"+ date_ob +"</h3>");
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})