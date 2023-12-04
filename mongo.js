const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://harkonentaneli:${password}@cluster0.pexjyyk.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", noteSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`new person ${result.name} saved`)
    mongoose.connection.close()
  })
} else {
  console.log("Not understood, did nothing..")
  process.exit(1)
}
