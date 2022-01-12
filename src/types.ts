import { Message } from 'discord.js'

// interface for the things
// types
export interface Thing {
  name: string
  probability?: number
  match?: RegExp
  exec(message: Message): any
  break?: boolean
}
