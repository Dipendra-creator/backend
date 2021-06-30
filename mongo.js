// const express = require('express')
// const app = express()
// const mongoose = require('mongoose')
//
// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>')
//     process.exit(1)
// }
//
// const password = process.argv[2]
//
// const url = `mongodb+srv://dipendra:${password}@phonebook.pef7q.mongodb.net/myFirstDatabase?retryWrites=true`
// //   mongodb+srv://dipendra:<password>@phonebook.pef7q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//
//
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//
// const personSchema = new mongoose.Schema({
//     id: Number,
//     name: String,
//     number: String,
// })
//
// const Person = mongoose.model('Person', personSchema)
//
// const person = new Person({
//     id: 5,
//     name: "Abella Danger",
//     number: "1 7 14 7 7 14",
// })
//
// // let person = {
// //     id: generateId(),
// //     name: "Abella Danger",
// //     number: "1 7 14 7 7 14",
// // }
//
// // person.save().then(result => {
// //     console.log('Person saved!')
// //     mongoose.connection.close()
// // })
// personSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })
//
// app.get('/api/persons', (request, response) => {
//     Person.find({}).then(notes => {
//         response.json(person)
//     })
// })
// Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(person)
//     })
//     mongoose.connection.close()
//   })
