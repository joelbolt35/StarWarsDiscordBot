const {SlashCommandBuilder} = require('discord.js')
const {EmbedBuilder} = require('discord.js')
const {Character} = require('../db')

async function execute(interaction) {
  const characterName = interaction.options.getString("name")
  const foundCharacter = await Character.findOne({name: characterName})

  if (foundCharacter) {
    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle(`Character Already Exists`)
      .setDescription(`Found Character with the name "${characterName}"`)
      .addFields({name: 'Credits', value: foundCharacter.credits.toString()})

    return interaction.reply({embeds: [embed], ephemeral: true})
  }

  const character = new Character({name: characterName, credits: 0})
  await character.save()

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`New Character Created!`)
    .addFields({name: 'Name', value: characterName, inline: true})
    .addFields({name: 'Credits', value: character.credits.toString(), inline: true})

  return interaction.reply({embeds: [embed]})
}

// Create Slash Command
async function createCommand() {
  return new SlashCommandBuilder()
    .setName('add-character')
    .setDescription('Add a new Character')
    .addStringOption(option => option.setName("name").setDescription("The name of the character").setRequired(true))
}

// Export Slash Command to send to Server
module.exports = {
  async data() {
    return await createCommand()
  },
  execute
}
