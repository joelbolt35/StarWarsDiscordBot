const { SlashCommandBuilder } = require('discord.js')

function performCommand(interaction) {
    let option1 = interaction.options.getInteger("option1")
    let option2 = interaction.options.getInteger("option2")

    if (option1 === 0 || option2 === 0) {
        return interaction.reply({
            content: 'Cannot select 0',
            ephemeral: true
        })
    }
    interaction.reply(`You didn't select 0! Nice!`)
}

// Create Slash Command
function createCommand() {
    return new SlashCommandBuilder()
        .setName('example')
        .setDescription('example description')
        .addIntegerOption(option => option.setName("option1").setDescription("I am the first option"))
        .addIntegerOption(option => option.setName("option2").setDescription("I am the second option"))
}

// Export Slash Command to send to Server
module.exports = {
    data: createCommand(),
    async execute(interaction) {
        await performCommand(interaction)
    }
}
