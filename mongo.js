const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('provide password')
  process.exit(0)
}

const password = process.argv[2]

const url = `mongodb+srv://niveditamagdum2015:${password}@practice.6gl40.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=practice`

mongoose.connect(url)

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String
  }
)

const Person = mongoose.model('person', personSchema)

if (process.argv.length === 5) {
  const person = new Person(
    {
      name: process.argv[3],
      number: process.argv[4]
    }
  )

  person.save().then(_result => {
    console.log('record saved')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, ' ', person.number)
    })
    mongoose.connection.close()
  })
}
