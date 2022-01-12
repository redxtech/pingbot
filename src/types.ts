import { Message, Snowflake } from 'discord.js'

// interface for the things
// types
export interface Thing {
  name: string
  probability?: string
  match?: RegExp
  exec(message: Message): any
  break?: boolean
}

export interface DBItem {
  guildID: Snowflake | undefined
  name: string
  value: number
}
