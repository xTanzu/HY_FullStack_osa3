const express = require("express")
const app = express()
app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
]

const generateRandomId = (max) => {
  let id = null
  do {
    id = Math.ceil(Math.random() * max)
  } while (persons.find(person => person.id === id))
  return id
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

app.get("/api/persons", (request, response) => {
  console.log("Getting persons")
  response.json(persons)
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

app.post("/api/persons", (request, response) => {
  const content = request.body

  if (!content.name || !content.number) {
    console.log("Name or number missing")
    return response.status(400).json({
      error: "Both name and number required"
    })
  } else if (persons.find(person => person.name === content.name)) {
    console.log("Name already exists!")
    return response.status(400).json({
      error: "Name already exists!"
    })
  }

  const person = {
    id: generateRandomId(persons.length * 2),
    name: content.name,
    number: content.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
