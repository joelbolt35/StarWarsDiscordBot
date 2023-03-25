const {SlashCommandBuilder} = require('discord.js')
const {EmbedBuilder} = require('discord.js')
const {Character} = require('../db')

async function execute(interaction) {
  const characterName = interaction.options.getString("name")
  const foundCharacter = await Character.findOne({name: characterName})

  if (!foundCharacter) {
    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle(`Character not found`)
      .setDescription(`Could not find a character with the name "${characterName}"`)
    return interaction.reply({embeds: [embed], ephemeral: true})
  }

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`Character Status`)
    .addFields({name: 'Name', value: foundCharacter.name, inline: true})
    .addFields({name: 'Credits', value: foundCharacter.credits.toString(), inline: true})

  return interaction.reply({embeds: [embed]})
}

// Create Slash Command
async function createCommand() {
  const characters = await Character.find()
  return new SlashCommandBuilder()
    .setName('character-status')
    .setDescription('Show a Characters Status')
    .addStringOption(option => {
      option.setName("name").setDescription("The name of the character").setRequired(true)
      characters.forEach(character => option.addChoices({name: character.name, value: character.name}))
      return option
    })
}

// Export Slash Command to send to Server
module.exports = {
  async data() {
    return await createCommand()
  },
  execute
}
