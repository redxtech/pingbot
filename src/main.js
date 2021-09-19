const chalk = require('chalk')
const { Client, Intents } = require('discord.js')

const { should } = require('./utils')
const { things } = require('./things')

const { token } = require('../config.json')

// create a client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

// announce the client is ready to go
client.once('ready', c => {
  console.log(chalk.green.bold(`Logged in as ${c.user.tag}...`))
})

// listen to each message
client.on('messageCreate', message => {
  // skip messages from pingbot & outside guild text channels
  if (message.channel.type === 'GUILD_TEXT' && message.member.user.id !== client.user.id) {
    // loop through all the things
    for (thing of things) {
      // should the thing run?
      if (should(thing.probability)) {
        // log it if it doesn't ruin every time
        if (thing.probability !== 1) {
          console.log(chalk.cyan('Executing ' + thing.name))
        }

        // run the thing's function
        thing.exec(message)
      }
    }
  }
})

// log in the client
client.login(token)

