import { join } from 'path'
import { Message } from 'discord.js'
import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'

import { oof } from '../config'

export const playOof = (m: Message): void => {
  // detect if the user is in a voice channel
  const member = m.member
  const channel = member?.voice.channel

  if (channel) {
    // do voice stuff
    if (channel?.id && channel.guild.id && channel.guild.voiceAdapterCreator) {
      // connect to the voice channel
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        // TODO fix this
        // @ts-ignore
        adapterCreator: channel.guild.voiceAdapterCreator
      })

      // create the audio player
      const oofSound = createAudioResource(oof)
      const player = createAudioPlayer()
      player.play(oofSound)

      // as soon as the connection is ready, play the sound
      connection.on(VoiceConnectionStatus.Ready, () => {
        const subscription = connection.subscribe(player)

        if (subscription) {
          // after everything is done
          setTimeout(() => {
            player.stop()
            connection.destroy()
          }, 1300)
        }
      })
    }
  } else {
    // reply with o o f if not in voice channel
    m.reply('o o f')
  }
}
