(async () => {
  require("dotenv").config()

  const fs = require('node:fs')
  const path = require('node:path')
  const { Client, Collection, Events, GatewayIntentBits } = require('discord.js')
  const { mongoose } = require('./db')

  const client = new Client({ intents: [GatewayIntentBits.Guilds] })

  client.commands = new Collection()
  const commandsPath = path.join(__dirname, 'commands')
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    const { data } = command
    const commandData = await data()
    client.commands.set(commandData.name, command)
  }

  client.once(Events.ClientReady, () => {
    console.log('Ready!')
  })

  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
      const { execute } = command;
      if (execute.length === 2) {
        await execute(interaction, client)
      } else {
        await execute(interaction)
      }
    } catch (error) {
      console.error(error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
      }
    }
  })
  // // Find the channel named "bot"
  // const channel = client.channels.cache.find(channel => channel.name === "bot")
  //
  // // Move the bot to the "bot" channel
  // const botMember = message.guild.members.cache.get(client.user.id)
  // botMember.voice.setChannel(channel)
  // Log in to Discord with your client's token
  client.login(process.env.DISCORD_TOKEN)


  // when your bot is shutting down, close the database connection
  process.on('SIGINT', () => {
    mongoose.connection.close()
    console.log('Mongoose connection closed')
  })
})()
