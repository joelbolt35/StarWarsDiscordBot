require("dotenv").config()
const mongoose = require('mongoose')

mongoose.connect(`mongodb+srv://${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.MONGO_USERNAME,
  pass: process.env.MONGO_PASSWORD
}).then(() => {
  console.log('Connected to MongoDB Atlas!')
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas: ', err)
})

// Define a schema for the Characters collection
const characterSchema = new mongoose.Schema({
  name: {type: String, required: true},
  credits: {type: Number, required: true}
}, {collection: process.env.CHARACTERS_COLLECTION})

// Create a model for the Characters collection
const Character = mongoose.model('Character', characterSchema)

// export the connection and model
module.exports = {mongoose, Character}