const {SlashCommandBuilder} = require('discord.js')
const {EmbedBuilder} = require('discord.js')
const {Character} = require('../db')

async function execute(interaction) {
  const characterName = interaction.options.getString('name')
  const amount = interaction.options.getInteger('amount')

  // Find the character in the database
  const character = await Character.findOne({name: characterName})

  // If the character is not found, send an error message
  if (!character) {
    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle(`Character not found`)
      .setDescription(`Could not find a character with the name "${characterName}"`)
    return interaction.reply({embeds: [embed], ephemeral: true})
  }

  // Update the credits and save to the database
  character.credits += amount
  await character.save()

  // Send a success message
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle(`Credits updated`)
    .setDescription(`${amount > 0 ? 'Added' : 'Removed'} ${Math.abs(amount)} credits ${amount > 0 ? 'to' : 'from'} ${character.name}.`)
    .addFields({name: 'New credits', value: character.credits.toString(), inline: true})
  return interaction.reply({embeds: [embed]})
}

// Create Slash Command
async function createCommand() {
  const characters = await Character.find()
  return new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Add or remove credits from a character')
    .addStringOption(option => {
      option.setName("name").setDescription("The name of the character").setRequired(true)
      characters.forEach(character => option.addChoices({name: character.name, value: character.name}))
      return option
    })
    .addIntegerOption(option =>
      option.setName("amount")
        .setDescription("The amount of credits to add or remove (positive or negative)")
        .setRequired(true))
}

// Export Slash Command to send to Server
module.exports = {
  async data() {
    return await createCommand()
  },
  execute
}
