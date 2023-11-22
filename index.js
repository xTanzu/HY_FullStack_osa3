const express = require("express")
const app = express()

const persons = [
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
