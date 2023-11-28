const conf = require("dotenv").config()
require("dotenv-expand").expand(conf)
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("dist"))

morgan.token("json_body", (req, res) => {
  if (req.headers["content-type"] === "application/json") {
    return JSON.stringify(req.body)
  }
  return ""
})

app.use(morgan((tokens, req, res) => {
  log_line_format = [
    tokens.method(req, res), 
    tokens.url(req, res), 
    tokens.status(req, res), 
    tokens.res(req, res, "content-length"), "-", 
    tokens["response-time"](req, res), "ms"
  ]
  if (req.method === "POST") {
    log_line_format.push(tokens.json_body(req, res))
  }
  return log_line_format.join(" ")
}))

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456"
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523"
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345"
//   },
//   {
//     id: 4,
//     name: "Mary Poppendick",
//     number: "39-23-6423122"
//   },
// ]

const generateRandomId = (max) => {
  let id = null
  do {
    id = Math.ceil(Math.random() * max)
  } while (persons.find(person => person.id === id))
  return id
}

app.get("/info", (request, response) => {
  console.log("forming info page")
  console.error("pöö")
  const persons_length = persons.length
  const now = Date.now()
  const date = new Date(now)
  const count_noun = persons_length === 1 ? "person" : "people"
  const html = `
    <p>Phonebook has info for ${persons_length} ${count_noun}</p>
    <p>${date.toString()}</p>
    `
  response.send(html)
})

app.get("/api/persons", (request, response) => {
  console.log("Getting persons")
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      console.log("Error fetching persons from db", error.message)
      response.status(500).json({
        error: "database error"
      })
    })
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  console.log(`Getting person id: ${id}`)
  person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).send("<p>No person found</p>")
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post("/api/persons", (request, response, next) => {
  const content = request.body

  if (!content.name || !content.number) {
    console.log("Name or number missing")
    return response.status(400).json({
      error: "Both name and number required"
    })
  }
  Person.find({name: content.name})
    .then(result => {
      if (result.length > 0) {
        console.log("Name already exists:", result[0].name)
        throw new Error(`Name '${result[0].name}' already exists!`)
        // return response.status(400).json({
        //   error: `Name '${result[0].name}' already exists!`
        // })
      }
      const person = Person({
        name: content.name,
        number: content.number
      })
      return person.save()
    })
    .then(newPerson => {
      console.log(`'${newPerson.name}' saved`)
      response.json(newPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
