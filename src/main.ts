import chalk from 'chalk'
import dayjs from 'dayjs'
import { Client, Intents, Message, Permissions } from 'discord.js'

import { sendMessage, should } from './utils'
import { things } from './things'

import { hostId, token } from '../config'
import { defaults, getProb, resetProb, setProb } from './db'

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
    // if the bot gets DMed, tell them that he has a gf
    sendMessage(message, 'get out of my dms, i have a gf', false)
  }
})

// command listener
// TODO move to own file
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'pingbot') {
    if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
      // pull the values from the options
      const name = interaction.options.get('name')?.value as string
      const value = interaction.options.get('value')?.value as number

      // and the guild ID
      const guildId = interaction.guildId

      // save the setting to the database
      setProb({ guildId, name, value })

      // respond to the message
      await interaction.reply({ content: `Probability updated - ${name}: ${value}.`, ephemeral: true });
    }
  } else if (commandName === 'pingbot-probabilities') {
    if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
      // get the guild ID
      const guildId = interaction.guildId

      //  grab all the values from the db
      const keys = Object.keys(defaults)
        .filter(p => p !== 'rolled')

      // accumulate probabilities into an array
      const probabilities = []
      for (const k of keys) {
        probabilities.push(`${k}: ${await getProb(guildId, k)}`)
      }

      // respond to the message
      interaction.reply({ content: probabilities.join('\n'), ephemeral: true })
    }
	} else if (commandName === 'pingbot-reset') {
    if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
      // remove entries from database
      resetProb(interaction.guildId)

      // respond to the message
      await interaction.reply({ content: 'Probabilities reset!', ephemeral: true})
    }
  }
})

// log in the client
client.login(token)
