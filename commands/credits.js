const { SlashCommandBuilder } = require('discord.js')


// Create Slash Command
let command = new SlashCommandBuilder()
    .setName('credits')
    .setDescription('Modify Character Credits')

// Export Slash Command to send to Server
module.exports = {
    data: command,
    async execute(interaction) {
        await credits(interaction)
    }
}
