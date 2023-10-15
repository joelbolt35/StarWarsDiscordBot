const { SlashCommandBuilder } = require('discord.js')
const { EmbedBuilder } = require('discord.js')
const { Character } = require('../db')

async function execute(interaction) {
  const characters = await Character.find()

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`All Characters`)

  characters.forEach(character => {
    embed.addFields({ name: character.name, value: `Credits: ${character.credits}` })
  })

  return interaction.reply({ embeds: [embed] })
}

// Create Slash Command
async function createCommand() {
  return new SlashCommandBuilder()
    .setName('list-characters')
    .setDescription('List all Characters')
}

// Export Slash Command to send to Server
module.exports = {
  async data() {
    return await createCommand()
  },
  execute
}
