const {mongoose, Character} = require('../db')

async function main() {
  try {
    // Delete a characters from the Characters collection
    await Character.deleteMany({name: 'Luke Skywalker'})
      .then(() => console.log('Deleted Luke Skywalker'))
      .catch(err => console.error(err))
    await Character.deleteMany({name: 'Dug'})
      .then(() => console.log('Deleted Dug'))
      .catch(err => console.error(err))

    const lukeSkywalker = new Character({name: 'Luke Skywalker', credits: 10000})
    await lukeSkywalker.save()

    const dug = new Character({name: 'Dug', credits: 2000})
    await dug.save()

    // Update a character in the Characters collection
    await Character.updateOne({name: 'Dug'}, {credits: 1500})
      .then(() => console.log('Updated Dug'))
      .catch(err => console.error(err))

    const characters = await Character.find()
    console.log(characters)

    // wait for any pending operations to complete
    await new Promise(resolve => setTimeout(resolve, 1000))

    // close the connection
    mongoose.connection.close()
  } catch (err) {
    console.error(err)
  }
}

main()