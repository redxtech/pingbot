module.exports = {
  things: [
    {
      "name": "Ping",
      "probability": 10,
      "exec": m => m.channel.send("@everyone")
    },
    {
      "name": "React",
      "probability": 5,
      "exec": m => m.react(m.guild.emojis.cache.random())
    }
  ]
}
