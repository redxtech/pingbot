import { GuildEmoji, Message } from 'discord.js'

import { generateNickname, sendMessage } from './utils'
import { playMonkey, playOof } from './funcs/voice'

import { Thing } from './types'

import { probabilities } from '../config'

// ideas:
// - create/assign random coloured roles

// function to get probability, and fallback if one isn't provided by config
const getProb = (n: string): number => {
  // default values
  const defaults = {
    ping: 10000,
    react: 100,
    nickname: 1000,
    dm: 1000,
    rolled: 1000
  }

  // return config value if it exists, return default value otherwise
  return Object.prototype.hasOwnProperty.call(probabilities, n)
    // @ts-expect-error can't expect user to use proper type in config.ts
    ? probabilities[n]
    // @ts-expect-error can't expect user to use proper type in config.ts
    : defaults[n]
}

// array of things
export const things: Thing[] = [
  {
    name: 'Ping',
    probability: getProb('ping'),
    exec: (m: Message) => sendMessage(m, '@everyone')
  },
  {
    name: 'React',
    probability: getProb('react'),
    exec: (m: Message) => m.react(m.guild?.emojis.cache.random() as GuildEmoji)
  },
  {
    name: 'Nickname',
    probability: getProb('nickname'),
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
    probability: getProb('dm'),
    exec: (m: Message): void => {
      // prepare a list of insults
      const insults = [
        'you bitch.',
        'your mother was a hamster and your father smelt of elderberries!',
        'ratio + you\'re balding',
        'let me guess, someone stole your sweetroll...'
      ]

      // send a random insult
      m.author.send(insults[Math.floor((Math.random() * insults.length))])
    }
  },
  {
    name: 'PingBot Love',
    probability: 1,
    exec: (m: Message): void => {
      ;/(\b(i\b.+\b(love|like|appreciate))|(thanks))\b.+\bpingbot\b/.test(
        m.content.toLowerCase()
      ) && sendMessage(m, 'heart <3')
    }
  },
  {
    name: 'PingBot Hate',
    probability: 1,
    exec: (m: Message): void => {
      ;/(\bi\b.+\b(hate|dislike)\b.+\bpingbot\b)|(\bpingbot\b.+\b(sucks|is\b.+\b(bad|garbage|trash|ass|shit|the worst))\b)|(fuck.+pingbot)/.test(
        m.content.toLowerCase()
      ) && sendMessage(m, ":'(")
    }
  },
  {
    name: 'O O F',
    probability: 1,
    exec: (m: Message) =>
      /o(\s*)o\1f/.test(m.content.toLowerCase()) && playOof(m)
  },
  {
    name: 'OO OO AA AA',
    probability: 1,
    exec: (m: Message) =>
      /oo oo aa aa/.test(m.content.toLowerCase()) && playMonkey(m)
  },
  {
    name: 'Rolled',
    probability: getProb('rolled'),
    exec: (m: Message) => sendMessage(m, '<https://youtu.be/dQw4w9WgXcQ>')
  }
]
