const { SlashCommandBuilder } = require('discord.js')

const boostSymbols = ['', '', 'AA', 'A', 'SA', 'S']
const setbackSymbols = ['', '', 'F', 'F', 'T', 'T']
const abilitySymbols = ['', 'S', 'S', 'SS', 'A', 'A', 'SA', 'AA']
const difficultySymbols = ['', 'F', 'FF', 'T', 'T', 'T', 'TT', 'FT']
const proficiencySymbols = ['', 'S', 'S', 'SS', 'SS', 'A', 'SA', 'SA', 'SA', 'AA', 'AA', 'R']
const challengeSymbols = ['', 'F', 'F', 'FF', 'FF', 'T', 'T', 'FT', 'FT', 'TT', 'TT', 'E']
const forceSymbols = ['D', 'D', 'D', 'D', 'D', 'D', 'DD', 'L', 'L', 'LL', 'LL', 'LL']

const diceSymbols = {
    '': ["Blank"],
    'S': ["Success"],
    'A': ["Advantage"],
    'F': ["Failure"],
    'T': ["Threat"],
    'R': ["Triumph"],
    'E': ["Despair"],
    'D': ["Dark"],
    'L': ["Light"],
    'SA': ["Success", "Advantage"],
    'SS': ["Success", "Success"],
    'AA': ["Advantage", "Advantage"],
    'FT': ["Failure", "Threat"],
    'FF': ["Failure", "Failure"],
    'TT': ["Threat", "Threat"],
    'DD': ["Dark", "Dark"],
    'LL': ["Light", "Light"]
}

const dicePool = {
    'ability': abilitySymbols,
    'proficiency': proficiencySymbols,
    'difficulty': difficultySymbols,
    'challenge': challengeSymbols,
    'boost': boostSymbols,
    'setback': setbackSymbols,
    'force': forceSymbols
}

let command = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll one or more dice')
let diceTypeOptions = []
for (let diceType in dicePool) {
    diceTypeOptions.push({ name: diceType, value: diceType })
}

for (let diceType in dicePool) {
    command.addIntegerOption(option =>
        option.setName(diceType)
            .setDescription(`Roll ${diceType} dice`))
}

module.exports = {
    data: command,
    async execute(interaction) {
        await roll(interaction)
    }
}

// Define the symbols on the dice
function rollDice(diceType, numDice) {
    let result = []
    for (let i = 0; i < numDice; i++) {
        const die = dicePool[diceType]
        let dieRoll = die[Math.floor(Math.random() * die.length)]
        result.push(dieRoll)
    }
    return result
}

function roll(interaction) {
    let results = []
    let totals = object_zero_default()

    for (let diceType in dicePool) {
        let totals_for_dice_type = object_zero_default()
        const numDice = interaction.options.getInteger(diceType)
        if (numDice == null || numDice === 0) continue

        let rolls = rollDice(diceType, numDice)
        rolls.forEach(symbol => {
            let values = diceSymbols[symbol]
            values.forEach(value => {
                totals[value]++
            })

            let key
            if (values.length === 1) {
                key = values[0]
            } else if (values[0] === values[1]) {
                key = `${values[0]} x2`
            } else {
                key = `${values[0]} + ${values[1]}`
            }
            totals_for_dice_type[key]++
        })
        let output_format = []
        for (const key in totals_for_dice_type) {
            output_format.push(`${totals_for_dice_type[key]} ${key}`)
        }
        let result = `**${numDice} ${diceType} dice**: ${output_format.join(', ')}`
        results.push(result)
    }

    if (results.length === 0) {
        return interaction.reply({
            content: 'You must select at least one dice to roll!',
            ephemeral: true
        })
    }
    interaction.reply(`**You rolled**\n${results.join('\n')}\n**Totals**: ${JSON.stringify(totals, null, 2)}`)
}

function object_zero_default() {
    return new Proxy({}, {
        get: function(obj, prop) {
            return prop in obj ? obj[prop] : 0
        }
    })
}