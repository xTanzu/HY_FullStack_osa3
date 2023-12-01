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
    err_msg = "malformatted id"
    console.log(err_msg)
    return res.status(400).json({ error: err_msg })
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }
  next(err)
}

app.get("/info", (request, response, next) => {
  console.log("forming info page")
  Person.find({})
    .then(persons => {
      const persons_length = persons.length
      const date = new Date(Date.now())
      const count_noun = persons_length === 1 ? "person" : "people"
      const html = `
        <p>Phonebook has info for ${persons_length} ${count_noun}</p>
        <p>${date.toString()}</p>
        `
      response.send(html)
    })
    .catch(error => next(error))
})

app.get("/api/persons", (request, response, next) => {
  console.log("Getting persons")
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  console.log(`Getting person id: ${request.params.id}`)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        err_msg = "person not found"
        response.status(404).json({ error: err_msg })
      }
    })
    .catch(error => next(error))
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

  // if (!content.name || !content.number) {
  //   err_msg = "Name or number missing"
  //   response.status(400).json({ error: err_msg })
  //   throw new Error(err_msg)
  // }

  // Person.find({name: content.name})
  //   .then(result => {
  //     if (result.length > 0) {
  //       err_msg = `Name '${result[0].name}' already exists`
  //       response.status(400).json({ error: err_msg })
  //       throw new Error(err_msg)
  //     }
  // })
  const person = Person({
    name: content.name,
    number: content.number
  })
  person.save()
    .then(newPerson => {
      console.log(`'${newPerson.name}' saved`)
      response.json(newPerson)
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const content = request.body

  if (!content.name || !content.number) {
    err_msg = "Name or number missing"
    response.status(400).json({ error: err_msg })
    throw new Error(err_msg)
  }

  const person = {
    name: content.name,
    number: content.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(`${updatedPerson.name} updated`)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
