import { execSync } from 'child_process'
import { GuildEmoji, Message, Permissions } from 'discord.js'

import { generateNickname, selectFrom, sendMessage, should } from './utils'
import { playMonkey, playOof } from './funcs/voice'
import { deployCommands } from './funcs/deploy-commands'

import { Thing } from './types'
import { hostId } from '../config'
import { chad, nou, rick, rock } from './strings'

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
    exec: (m: Message) => m.react(m.guild?.emojis.cache.random() as GuildEmoji || ':x:')
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
      m.author.send(selectFrom(insults))
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
    match: /(\bi\b.+\b(hate|dislike)\b.+\bping\s*bot\b)|(\bfuck\b.+\bping\s*bot\b)|(\bping\s*bot (suck|eat|munche)s (dick|cock)\b)/,
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
		name: 'No U',
		match: /\bping\s*bot\b.+\b(is|you're|youre|your|ur)\b.+\b(gay|bad|garbage|trash|ass|shit|the\b.+\bworst)\b/,
		exec: (m: Message): void => {
			const replies = [
				nou,
				'https://i.imgur.com/t1M9ffQ.gif',
				'https://i.imgur.com/b3Yz5Qj.png',
				'https://i.imgur.com/wa24eIx.gif',
				'https://i.imgur.com/ejWUm1R.jpg',
				'https://i.imgur.com/UMyQx52.png',
				'https://i.imgur.com/aEBqGuU.jpg',
				'https://i.imgur.com/AoETXik.jpg'
			]
			sendMessage(m, selectFrom(replies))
		}
	},
  {
    name: 'Chance',
    probability: 'chance',
    exec: (m: Message): void => {
      // list of options
      const opts = [
				chad,
				'https://i.imgur.com/1pihZlw.jpg', // you pass butter
				rock,
				'https://i.imgur.com/sB6Djce.png', // christian server
				'https://i.imgur.com/6pwYUEz.jpg', // doubt
				'https://i.imgur.com/4jS5pbH.png' // effect on people
      ]

      // send a random selection from the options
      sendMessage(m, selectFrom(opts))
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
      sendMessage(m, selectFrom(opts))
    }
  },
	{
		name: 'GodWords',
		match: /!pingbot words/,
		exec: async (m: Message): Promise<void> => {
			try {
				// generate some god words
				const godWords = execSync('echo "$(shuf -n 10 /usr/share/dict/words --random-source=/dev/urandom | tr \'\n\' \' \')"')
				sendMessage(m, godWords.toString())
			} catch (err) {
				sendMessage(m, 'couldn\'t generate god words')
				console.error(err)
			}
		}
	},
	{
		name: 'GodPassage',
		match: /!pingbot passage/,
		exec: async (m: Message): Promise<void> => {
			try {
				// generate a god passage
				const godWords = execSync(
					`${__dirname}/funcs/GodPassage.sh`
				)
				sendMessage(m, godWords.toString())
			} catch (err) {
				sendMessage(m, 'couldn\'t generate god passage')
				console.error(err)
			}
		}
	},
	{
		name: 'Server List',
		match: /!pingbot servers/,
		exec: (m: Message) => m.member?.user.id === hostId
			? sendMessage(m, ['**server list:**', ...m.client.guilds.cache.map(g => g.name)].join('\n'))
			: m.react('❌')
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
