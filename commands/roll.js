const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

const boostSymbols = ['', '', 'AA', 'A', 'SA', 'S']
const setbackSymbols = ['', '', 'F', 'F', 'T', 'T']
const abilitySymbols = ['', 'S', 'S', 'SS', 'A', 'A', 'SA', 'AA']
const difficultySymbols = ['', 'F', 'FF', 'T', 'T', 'T', 'TT', 'FT']
const proficiencySymbols = ['', 'S', 'S', 'SS', 'SS', 'A', 'SA', 'SA', 'SA', 'AA', 'AA', 'R']
const challengeSymbols = ['', 'F', 'F', 'FF', 'FF', 'T', 'T', 'FT', 'FT', 'TT', 'TT', 'E']
const forceSymbols = ['D', 'D', 'D', 'D', 'D', 'D', 'DD', 'L', 'L', 'LL', 'LL', 'LL']

const ABILITY = 'green(ability)'
const PROFICIENCY = 'yellow(proficiency)'
const DIFFICULTY = 'red(challenge)'
const CHALLENGE = 'green(ability)'
const BOOST = 'blue(boost)'
const SETBACK = 'black(setback)'
const FORCE = 'white(force)'

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

const dicePool = {}
dicePool[ABILITY] = abilitySymbols
dicePool[PROFICIENCY] = proficiencySymbols
dicePool[DIFFICULTY] = difficultySymbols
dicePool[CHALLENGE] = challengeSymbols
dicePool[BOOST] = boostSymbols
dicePool[SETBACK] = setbackSymbols
dicePool[FORCE] = forceSymbols

const diceColor = {}
diceColor[ABILITY] = ['GREEN', '\u001b[0;32m']
diceColor[PROFICIENCY] = ['YELLOW', '\u001b[0;33m']
diceColor[DIFFICULTY] = ['PURPLE', '\u001b[0;35m']
diceColor[CHALLENGE] = ['RED', '\u001b[0;31m']
diceColor[BOOST] = ['BLUE', '\u001b[0;34m']
diceColor[SETBACK] = ['BLACK', '\u001b[0;30m']
diceColor[FORCE] = ['WHITE', '\u001b[0;37m']

async function execute(interaction) {
  let results = []
  let totals = objectZeroDefault()

  for (let diceType in dicePool) {
    let totalsForDiceType = objectZeroDefault()
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
      totalsForDiceType[key]++
    })
    let outputFormat = []
    for (const key in totalsForDiceType) {
      outputFormat.push(`${totalsForDiceType[key]} ${key}`)
    }
    let result = {
      name:`${numDice} ${diceType} dice (${diceColor[diceType][0]})`,
      value: "```ansi\n"+diceColor[diceType][1] + outputFormat.join('\n') + "```"}
    results.push(result)
  }

  if (results.length === 0) {
    const embed = new EmbedBuilder()
      .setColor("DarkRed")
      .setTitle("You must select at least one dice to roll!")

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    })
  }

  const embed = new EmbedBuilder()
    .setColor("DarkBlue")
    .setTitle(`Here's the role!`)
  results.forEach(result => embed.addFields(result))

  const embed2 = new EmbedBuilder()
    .setColor("DarkBlue")
    .setTitle(`Total of each Symbol`)
  for (const symbol in totals) {
    embed2.addFields({name: symbol, value: totals[symbol].toString(), inline: true})
  }
  return interaction.reply({embeds: [embed, embed2]})
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

function objectZeroDefault() {
  return new Proxy({}, {
    get: function (obj, prop) {
      return prop in obj ? obj[prop] : 0
    }
  })
}

// Create Slash Command
async function createCommand() {
  let command = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll one or more dice')
  for (let diceType in dicePool) {
    command.addIntegerOption(option =>
      option.setName(diceType)
        .setDescription(`Roll ${diceType} dice`))
  }
  return command
}

// Export Slash Command to send to Server
module.exports = {
  async data() {
    return await createCommand()
  },
  execute
}
