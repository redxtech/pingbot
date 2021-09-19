const { generateNickname } = require('./utils')
const { probabilities } = require('../config.json')

module.exports = {
  things: [
    {
      name: "Ping",
      probability: probabilities.ping || 10000,
      exec: m => m.channel.send("@everyone")
    },
    {
      name: "React",
      probability: probabilities.react || 100,
      exec: m => m.react(m.guild.emojis.cache.random())
    },
    {
      name: "Nickname",
      probability: probabilities.nickname || 1000,
      exec: m => m.member.setNickname(generateNickname(), 'you just got pingbotted')
        .then()
        .catch(err => console.error(`Couldn't change ${m.member.user.tag}'s nickname: ${err}`))
    },
    {
      name: "PingBot Love",
      probability: 1,
      exec: m => /\bi\b.+\b(love|like|appreciate)\b.+\bpingbot\b/.test(m.content.toLowerCase())
        && m.reply('heart <3')
    },
    {
      name: "PingBot Hate",
      probability: 1,
      exec: m => /(\bi\b.+\b(hate|dislike)\b.+\bpingbot\b)|(\bpingbot\b.+\b(sucks|is (bad|garbage|trash|ass|shit))\b)|(fuck.+pingbot)/.test(m.content.toLowerCase())
        && m.reply(":'(")
    }
  ]
}
