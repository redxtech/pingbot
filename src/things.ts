import { execSync } from 'child_process'
import { GuildEmoji, Message, Permissions } from 'discord.js'

import { generateNickname, sendMessage, should } from './utils'
import { playMonkey, playOof } from './funcs/voice'
import { deployCommands } from './funcs/deploy-commands'

import { Thing } from './types'
import { hostId } from '../config'
import { chad, rick, rock } from './strings'

// ideas:
// - create/assign random coloured roles

// array of things
export const things: Thing[] = [
  {
    name: 'Ping',
    probability: 'ping',
    exec: (m: Message) => sendMessage(m, '@everyone')
  },
  {
    name: 'React',
    probability: 'react',
    exec: (m: Message) => m.react(m.guild?.emojis.cache.random() as GuildEmoji)
  },
  {
    name: 'Nickname',
    probability: 'nickname',
    exec: (m: Message) =>
      m.member
        ?.setNickname(generateNickname(), 'you just got pingbotted')
        .then()
        .catch((err: Error) =>
          console.error(
            `Couldn't change ${m.member?.user.tag}'s nickname: ${err}`
          )
        )
  },
  {
    name: 'DM',
    probability: 'dm',
    exec: (m: Message): void => {
      // prepare a list of insults
      const insults = [
        'you bitch.',
        'your mother was a hamster and your father smelt of elderberries!',
        'ratio + you\'re balding',
        'let me guess, someone stole your sweetroll...',
        'ha! you just got pingbotted!'
      ]

      // send a random insult
      m.author.send(insults[Math.floor((Math.random() * insults.length))])
      .then()
      .catch((err: Error) => {
        console.error(`Couldn't send DM to ${m.member?.user.tag}: ${err}`)
      })
    }
  },
  {
    name: 'PingBot Love',
    match: /(\b((i|we)\b.+\b(love|like|appreciate))|(thanks))\b.+\bping\s*bot\b/,
    exec: (m: Message): void => sendMessage(m, 'heart <3')
  },
  {
    name: 'PingBot Hate',
    match: /(\bi\b.+\b(hate|dislike)\b.+\bping\s*bot\b)|(\bping\s*bot\b.+\b(sucks|(is|ur|your|you're|youre)\b.+\b(bad|garbage|trash|ass|shit|the worst))\b)|(\bfuck\b.+\bping\s*bot\b)|(\bping\s*bot (suck|eat|munche)s (dick|cock)\b)/,
    exec: (m: Message): void => sendMessage(m, should(2) ? ":'(" : ")':")
  },
  {
    name: 'O O F',
    match: /\bo(\s*)o\1f\b/,
    exec: (m: Message) => playOof(m)
  },
  {
    name: 'OO OO AA AA',
    match: /oo oo aa aa/,
    exec: (m: Message) => playMonkey(m)
  },
  {
    name: 'Birthday',
    match: /\bbirthday\b/,
    exec: (m: Message): void => {
      const birthdateEmote = m.guild?.emojis.cache.find(e => /birthday/.test(e.name?.toLowerCase() || ''))

      if (birthdateEmote) {
        m.react(birthdateEmote)
      }
    }
  },
  {
    name: 'Chance',
    probability: 'chance',
    exec: (m: Message): void => {
      // list of options
      const opts = [
        chad,
        'https://i.imgur.com/1pihZlw.jpg',
				rock,
				'https://i.imgur.com/sB6Djce.png'
      ]

      // send a random selection from the options
      sendMessage(m, opts[Math.floor((Math.random() * opts.length))])
    }
  },
  {
    name: 'Rolled',
    probability: 'rolled',
    exec: (m: Message): void => {
      // list of options
      const opts = [
        '<https://youtu.be/dQw4w9WgXcQ>',
        '<https://youtu.be/ub82Xb1C8os>',
        rick,
        '<https://youtu.be/M5V_IXMewl4>',
        '<https://u.nu/Noigp>'
      ]

      // send a random selection from the options
      sendMessage(m, opts[Math.floor((Math.random() * opts.length))])
    }
  },
	{
		name: 'GodWords',
		match: /!pingbot words/,
		exec: async (m: Message): Promise<void> => {
			// generate some god words
			const godWords = execSync('echo "$(shuf -n 10 /usr/share/dict/words --random-source=/dev/urandom | tr \'\n\' \' \')"')
			sendMessage(m, godWords.toString())
		}
	},
	{
		name: 'GodPassage',
		match: /!pingbot passage/,
		exec: async (m: Message): Promise<void> => {
			// generate a god passage
			const godWords = execSync(
				`${__dirname}/funcs/GodPassage.sh`
			)
			sendMessage(m, godWords.toString())
		}
	},
  {
    name: 'Deploy Commands',
    match: /!pingbot deploy/,
    exec: async (m: Message): Promise<void> => {
      if (m.member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD) || m.author.id === hostId) {
        try {
          await deployCommands(m.client.user?.id, m.guildId)
          m.react('✅')
        } catch (err) {
          console.error(err)
          m.react('❌')
        }
      } else {
          m.react('❌')
      }
    }
  }
]
