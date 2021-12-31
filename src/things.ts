import { GuildEmoji, Message } from 'discord.js'

import { generateNickname } from './utils'
import { playOof } from './voice'

import { Thing } from './types'

import { probabilities } from '../config.json'

// ideas:
// - create/assign random coloured roles

export const things: Thing[] = [
  {
    name: 'Ping',
    probability: probabilities.ping || 10000,
    exec: (m: Message) => m.channel.send('@everyone')
  },
  {
    name: 'React',
    probability: probabilities.react || 100,
    exec: (m: Message) => m.react(m.guild?.emojis.cache.random() as GuildEmoji)
  },
  {
    name: 'Nickname',
    probability: probabilities.nickname || 1000,
    exec: (m: Message) => m.member?.setNickname(generateNickname(), 'you just got pingbotted')
      .then()
      .catch((err: Error) => console.error(`Couldn't change ${m.member?.user.tag}'s nickname: ${err}`))
  },
  {
    name: 'PingBot Love',
    probability: 1,
    exec: (m: Message) => /\bi\b.+\b(love|like|appreciate)\b.+\bpingbot\b/.test(m.content.toLowerCase()) &&
      m.reply('heart <3')
  },
  {
    name: 'PingBot Hate',
    probability: 1,
    exec: (m: Message) => /(\bi\b.+\b(hate|dislike)\b.+\bpingbot\b)|(\bpingbot\b.+\b(sucks|is (bad|garbage|trash|ass|shit))\b)|(fuck.+pingbot)/.test(m.content.toLowerCase()) &&
      m.reply(":'(")
  },
  {
    name: 'O O F',
    probability: 1,
    exec: (m: Message) => {
      playOof(m)
    }
  },
  {
    name: 'Rolled',
    probability: 10,
    exec: (m: Message) => m.channel.send('<https://youtu.be/dQw4w9WgXcQ>')
  }
]
