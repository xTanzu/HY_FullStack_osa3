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

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }
  next(err)
}

app.get("/info", (request, response) => {
  console.log("forming info page")
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

app.get("/api/persons", (request, response, next) => {
  console.log("Getting persons")
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        console.log(`deleted '${result.name}'`)
      } else {
        console.log("Nothing to delete")
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const content = request.body

  if (!content.name || !content.number) {
    err_msg = "Name or number missing"
    response.status(400).json({ error: err_msg })
    throw new Error(err_msg)
  }

  Person.find({name: content.name})
    .then(result => {
      if (result.length > 0) {
        err_msg = `Name '${result[0].name}' already exists`
        response.status(400).json({ error: err_msg })
        throw new Error(err_msg)
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

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
