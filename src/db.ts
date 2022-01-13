import { Snowflake } from 'discord-api-types'
import { DBItem } from './types'

import { probabilities } from '../config'

import Datastore = require('nedb')

// create object to interact with db
const db = new Datastore({
  filename: 'probabilities.nedb',
  autoload: true
})

// default values
export const defaults = {
  ping: 10000,
  react: 100,
  nickname: 1000,
  dm: 1000,
  rolled: 1000
}

// function to get probability, and fallback if one isn't provided by config
const getDefaultProb = (n: string): number => {
  // return config value if it exists, return default value otherwise
  return Object.prototype.hasOwnProperty.call(probabilities, n)
    // @ts-expect-error can't expect user to use proper type in config.ts
    ? probabilities[n]
    // @ts-expect-error can't expect user to use proper type in config.ts
    : defaults[n]
}

// function to set probability in the db
export const setProb = async (item: DBItem): Promise<boolean> => {
  // wrap with a promise
  return new Promise((resolve, reject) => {
    // upsert into the database the config option
    db.update(
      { guildId: item.guildId, name: item.name },
      item,
      { upsert: true },
      err => {
        // return the status of the upsert
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      }
    )
  })
}

// function to get probability from the db
export const getProb = async (guildId: Snowflake | undefined, name: string): Promise<number> => {
  // wrap with a promise
  return new Promise((resolve, reject) => {
    // find a single item from a guild with a specific name
    db.findOne({ guildId, name }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        // return doc value unless doc is null (not found)
        if (doc) {
          resolve(doc.value)
        } else {
          // find a fallback if there's a default probability
          const fallback = getDefaultProb(name)
          if (fallback) {
            resolve(fallback)
          } else {
            reject(new Error('unknown setting'))
          }
        }
      }
    })
  })
}

// function to reset probabilities for a server
export const resetProb = async (guildId: Snowflake | null): Promise<void> => {
  // wrap with a promise
  return new Promise((resolve, reject) => {
    // remove all entries from the guild
    db.remove({ guildId }, { multi: true }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
