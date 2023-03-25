require("dotenv").config()
const {SlashCommandBuilder} = require('discord.js')
const {EmbedBuilder} = require('discord.js')
const {Character} = require('../db')
const {REST, Routes} = require('discord.js')

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN)

async function execute(interaction, client) {
  await interaction.deferReply();
  const characterName = interaction.options.getString("name")
  const foundCharacter = await Character.findOne({name: characterName})

  if (!foundCharacter) {
    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle(`Character Does not Exist!`)
      .setDescription(`Could not find Character with the name "${characterName}"`)

    return await interaction.editReply({embeds: [embed]});
  }
  await foundCharacter.deleteOne()

  const embed = new EmbedBuilder()
    .setColor("Blue")
    .setTitle(`Character Deleted!`)
    .addFields({name: 'Name', value: characterName, inline: true})

  // Update all the commands by re-registering them with Discord's API
  const commands = await rest.get(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID))
  for (const command of client.commands.values()) {
    const { data } = command;
    const commandData = await data();

    if (
      commandData.name !== "character-status" &&
      commandData.name !== "credits" &&
      commandData.name !== "delete-character"
    ) continue;

    const existingCommand = commands.find(c => c.name === commandData.name);
    if (existingCommand) {
      await rest.patch(
        Routes.applicationGuildCommand(process.env.APP_ID, process.env.GUILD_ID, existingCommand.id),
        {body: commandData.toJSON()}
      )
    }
  }

  await interaction.editReply({embeds: [embed]});
}

// Create Slash Command
async function createCommand() {
  const characters = await Character.find()
  return new SlashCommandBuilder()
    .setName('delete-character')
    .setDescription('Delete a Character')
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
