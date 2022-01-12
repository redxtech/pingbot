import { Snowflake } from 'discord-api-types'
import { DBItem } from './types'

import Datastore = require('nedb')

// create object to interact with db
const db = new Datastore({
  filename: 'probabilities.nedb',
  autoload: true
})

// function to get probability, and fallback if one isn't provided by config
const getDefaultProb = (n: string): number => {
  // default values
  const defaults = {
    ping: 10000,
    react: 100,
    nickname: 1000,
    dm: 1000,
    rolled: 1000
  }

  // return config value if it exists, return default value otherwise
  return Object.prototype.hasOwnProperty.call(defaults, n)
    // @ts-expect-error can't expect user to use proper type in config.ts
    ? defaults[n]
    : null
}

// function to set probability in the db
export const setProb = async (item: DBItem): Promise<boolean> => {
  // wrap with a promise
  return new Promise((resolve, reject) => {
    // upsert into the database the config option
    db.update(
      { guildID: item.guildID, name: item.name },
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
export const getProb = async (guildID: Snowflake | undefined, name: string): Promise<number> => {
  // wrap with a promise
  return new Promise((resolve, reject) => {
    // find a single item from a guild with a specific name
    db.findOne({ guildID, name }, (err, doc) => {
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
