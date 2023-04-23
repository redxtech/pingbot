import { DeleteResult, MongoClient } from 'mongodb';
import { Snowflake } from 'discord-api-types'
import { DBItem } from './types'

import { config } from './config'


// initialization
const connectURL = (config.get('db.url')
  ? config.get('db.url')
  : `mongodb://${config.get('db.username')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port').toString()}`)
  || ''

if (!config.get('db.url') && !config.get('db.host')) {
  throw Error('database url or hostname required')
}

const client = new MongoClient(connectURL)
export const dbclinet = client.connect().then(() => db) // workaround to wait for db connect
const db = client.db(config.get('db.name'))
const probs = db.collection('probabilities')

// get probablities from config
export const probabilities = config.get('probabilities')

// function to get probability
const getDefaultProb = (n: string): number => {
  // @ts-expect-error idk what's up here
  return probabilities[n]
}

// function to set probability in the db
export const setProb = async (item: DBItem): Promise<boolean> => {
  const update = await probs.updateOne({ guildId: item.guildId, name: item.name }, { $set: item }, { upsert: true })

  return update.modifiedCount || update.upsertedCount ? true : false
}

// function to get probability from the db
export const getProb = async (guildId: Snowflake | null | undefined, name: string): Promise<number> => {
  const prob = await probs.findOne({ guildId, name })

  return prob ? prob.value : getDefaultProb(name)
}

// function to reset probabilities for a server
export const resetProb = async (guildId: Snowflake | null): Promise<DeleteResult> => {
  return probs.deleteMany({ guildId })
}
