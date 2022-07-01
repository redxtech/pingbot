import { Message, MessageOptions, MessagePayload } from 'discord.js'

// utility functions

// random number generator
const random = (upTo: number): number => Math.floor(Math.random() * upTo) + 1

// probability tester
export const should = (outOf: number): boolean => random(outOf) === 1

// capitalize the first letter
export const upCase = (str: string): string => `${str[0].toUpperCase()}${str.slice(1)}`

// select random element
export const selectFrom = (arr: string[]): string => arr[Math.floor((Math.random() * arr.length))]

// generate a random string of characters to use as a nickname
export const generateNickname = (): string => {
  // initialize empty array to store the name in
  const nicknameArray = []

  // a list of possible characters to show up in the nickname
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{}|;\':",./<>? '

  // the length of the nickname, between 6 & 26
  const nicknameLength = 6 + random(20)

  // push a random character from the characters into the nickname array <nicknameLength> times
  for (let i = 0; i < nicknameLength; i++) {
    nicknameArray.push(characters.charAt(random(characters.length)))
  }

  // return the nickname as a string
  return nicknameArray.join('')
}

// function to send a message with a typing indicator
export const sendMessage = (m: Message, content: string | MessageOptions | MessagePayload, reply = true): void => {
  // send the typing indicator
  m.channel.sendTyping()

  // wait a bit, then send the message
  setTimeout(() => {
    if (reply) {
      m.reply(content)
    } else {
      m.channel.send(content)
    }
  }, 750)
}

