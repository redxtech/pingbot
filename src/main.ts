import chalk from 'chalk'
import dayjs from 'dayjs'
import { Client, Intents, Message } from 'discord.js'

import { getProb } from './db'
import { selectFrom, sendMessage, should } from './utils'
import { things } from './things'
import { slashHandler } from './slash-commands'

import { config } from './config'


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
client.on('messageCreate', async (message: Message) => {
  // skip messages from pingbot & outside guild text channels
  if (
    message.channel.type === 'GUILD_TEXT' &&
    !message.member?.user?.bot
  ) {
    // loop through all the things
    for (const thing of things) {
      // if probability, should pull from db
      const prob = thing.probability
        ? await getProb(message.guild?.id, thing.probability)
        : 0

      // run it if its probability is picked or if it's a message match
      if (
        (prob && should(prob))
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
    // if the bot gets DMed, respond with stuff
		const replies = [
			'get out of my dms, i have a gf',
			"that's not what your mom said last night",
			"bobby? is that you? i haven't seen you in ages!",
			"i don't think this is going to work between us",
			'who even are you again?',
			'idk man sounds like bitch talk to me...',
			"speaking of, pierogies really do be kinda slappin' ngl",
			"hold that thought - i gotta drop a phat shit, i'll be back in a few hours",
			"ayy no way! oh wait it's you nvm, pretend i'm ignoring you",
			"ok i'm gonna be completely honest i didn't comprehend a single word of what you just said, you're too hot\n"
			+ "try sending some nudes that will help me focus i think",
			'hello yes this is pingbot how can i help?'
		]
    sendMessage(message, selectFrom(replies), false)
  }
})

// command listener
client.on('interactionCreate', slashHandler)

// log in the client
client.login(config.get('token'))

