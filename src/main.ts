import chalk from 'chalk'
import { Client, Intents, Message } from 'discord.js'

import { should } from './utils'
import { things } from './things'

import { token } from '../config.json'

// create a client instance
const client: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

// announce the client is ready to go
client.once('ready', (c: Client) => {
  console.log(chalk.green.bold(`Logged in as ${c.user?.tag}...`))
})

// listen to each message
client.on('messageCreate', (message: Message) => {
  // skip messages from pingbot & outside guild text channels
  if (message.channel.type === 'GUILD_TEXT' && message.member?.user.id !== client.user?.id) {
    // loop through all the things
    for (const thing of things) {
      // should the thing run?
      if (should(thing.probability)) {
        // log it if it doesn't run every time
        if (thing.probability !== 1) {
          console.log(chalk.cyan(`Executing Thing: ${thing.name}`))
        }

        // run the thing's function
        thing.exec(message)

        // exit since we only want one thing to run at once
        if (thing.break) {
          break
        }
      }
    }
  }
})

// log in the client
client.login(token)
