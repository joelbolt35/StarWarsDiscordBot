(async () => {
  require("dotenv").config()
  const {REST, Routes} = require('discord.js')

  // Construct and prepare an instance of the REST module
  const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN)

  try {
    const commands = await rest.get(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID))

    console.log(`Started removing ${commands.length} application (/) commands.`)

    const commandIds = commands.map(command => command.id);
    rest.put(Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID), { body: [] })
      .then(() => console.log(`Successfully deleted ${commandIds.length} commands`))
      .catch(console.error);

    console.log(`Successfully removed ${commands.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
