const mongoose = require('mongoose')

// Load environement variables from .env file

require('dotenv').config()

// Grab the MongoDB URI from .env

const url = process.env.MONGODB_URI

//confirgure Mongoose

mongoose.set('strictQuery', false)

//Connect to DB

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
  }
}

connectToMongoDB()

// Define schema for a phonebook entry

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 10,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
    },
  },
})

// Customize JSON output of the Person model

personSchema.set('toJson', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.id.toString()
    delete returnedObject._id
    delete returnedObject._v
  },
})

// Create a mongoose model named Person using the personSchema

const Person = mongoose.model('Person', personSchema)

// Export Person model to use elsewhere

module.exports = Person
