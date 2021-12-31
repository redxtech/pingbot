import { GuildEmoji, Message } from 'discord.js'

import { generateNickname } from './utils'
import { playOof } from './voice'

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
    rolled: 1000
  }

  // return config value if it exists, return default value otherwise
  return Object.prototype.hasOwnProperty.call(probabilities, n)
    // @ts-ignore
    ? probabilities[n]
    // @ts-ignore
    : defaults[n]
}

// array of things
export const things: Thing[] = [
  {
    name: 'Ping',
    probability: getProb('ping'),
    exec: (m: Message) => m.channel.send('@everyone')
  },
  {
    name: 'React',
    probability: getProb('react'),
    exec: (m: Message) => m.react(m.guild?.emojis.cache.random() as GuildEmoji)
  },
  {
    name: 'Nickname',
    probability: getProb('nickname'),
    exec: (m: Message) => m.member?.setNickname(generateNickname(), 'you just got pingbotted')
      .then()
      .catch((err: Error) => console.error(`Couldn't change ${m.member?.user.tag}'s nickname: ${err}`))
  },
  {
    name: 'PingBot Love',
    probability: 1,
    exec: (m: Message) => {
      /\bi\b.+\b(love|like|appreciate)\b.+\bpingbot\b/.test(m.content.toLowerCase()) &&
      m.reply('heart <3')
    }
  },
  {
    name: 'PingBot Hate',
    probability: 1,
    exec: (m: Message) => {
      /(\bi\b.+\b(hate|dislike)\b.+\bpingbot\b)|(\bpingbot\b.+\b(sucks|is\b.+\b(bad|garbage|trash|ass|shit))\b)|(fuck.+pingbot)/.test(m.content.toLowerCase()) &&
      m.reply(":'(")
    }
  },
  {
    name: 'O O F',
    probability: 1,
    exec: (m: Message) => /o\s?o\s?f/.test(m.content.toLowerCase()) && playOof(m)
  },
  {
    name: 'Rolled',
    probability: getProb('rolled'),
    exec: (m: Message) => m.channel.send('<https://youtu.be/dQw4w9WgXcQ>')
  }
]
