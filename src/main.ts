import chalk from 'chalk'
import dayjs from 'dayjs'
import { Client, Intents, Message } from 'discord.js'

import { sendMessage, should } from './utils'
import { things } from './things'

import { token } from '../config'

// create a client instance
const client: Client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ],
  partials: [
    'CHANNEL'
  ]
})

// announce the client is ready to go
client.once('ready', (c: Client) => {
  console.log(chalk.green.bold(`Logged in as ${c.user?.tag}...`))
})

// listen to each message
client.on('messageCreate', (message: Message) => {
  // skip messages from pingbot & outside guild text channels
  if (
    message.channel.type === 'GUILD_TEXT' &&
    !message.member?.user?.bot
  ) {
    // loop through all the things
    for (const thing of things) {
      // run it if it's probability is picked or if it's a message match
      if (
        (thing.probability && should(thing.probability))
        ||
        (thing.match && thing.match.test(message.content.toLowerCase()))
      ) {
        // log the thing
        const ds = dayjs().format('YYYY-MM-DD HH:mm:ss')
        console.log(chalk.cyan(`[${ds}] Executing Thing: ${thing.name}`))

        // run the thing's function
        thing.exec(message)

        // exit since we only want one thing to run at once
        if (thing.break) {
          break
        }
      }
    }
  } else if (
    message.channel.type === 'DM' &&
    message.author.id !== client.user?.id
  ) {
    // if the bot gets DMed, tell them that he has a gf
    sendMessage(message, 'get out of my dms, i have a gf', false)
  }
})

// log in the client
client.login(token)
