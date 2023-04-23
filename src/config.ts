import convict from 'convict';

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  token: {
    doc: 'Discord bot token',
    format: String,
    default: '',
    env: 'TOKEN'
  },
  clientID: {
    doc: 'Discord bot client ID',
    format: String,
    default: null,
    env: 'CLIENT_ID'
  },
  hostID: {
    doc: 'UUID of bot\'s host',
    format: String,
    default: null,
    env: 'HOST_ID'
  },
  probabilities: {
    ping: {
      doc: 'Probability of pinging',
      format: 'nat',
      default: 10_000,
      env: 'PROB_PING',
      arg: 'prob-ping',
    },
    react: {
      doc: 'Probability of reacting',
      format: 'nat',
      default: 100,
      env: 'PROB_REACT',
      arg: 'prob-react',
    },
    nickname: {
      doc: 'Probability of nicknaming',
      format: 'nat',
      default: 1_000,
      env: 'PROB_NICKNAME',
      arg: 'prob-nickname',
    },
    dm: {
      doc: 'Probability of sending a DM',
      format: 'nat',
      default: 1_000,
      env: 'PROB_DM',
      arg: 'prob-dm',
    },
    chance: {
      doc: 'Probability of doing the chad chance thing',
      format: 'nat',
      default: 1_000,
      env: 'PROB_CHANCE',
      arg: 'prob-chance',
    },
    rolled: {
      doc: 'Probability of getting rolled',
      format: 'nat',
      default: 1_000,
      env: 'PROB_ROLLED',
      arg: 'prob-rolled',
    },
    sentiment: {
      doc: 'Probability of pingbot using sentiment analysis',
      format: 'nat',
      default: 2,
      env: 'PROB_SENTIMENT',
      arg: 'prob-sentiment'
    }
  },
  sounds: {
    oof: {
      doc: 'Path to oof sound file',
      format: String,
      default: '/usr/src/bot/src/resources/oof.ogg',
      env: 'PATH_OOF',
      arg: 'path-oof'
    },
    monkey: {
      doc: 'Path to monkey sound file',
      format: String,
      default: '/usr/src/bot/src/resources/oo-oo-aa-aa.ogg',
      env: 'PATH_MONKEY',
      arg: 'path-monkey'
    },
  }
});

config.loadFile(process.cwd() + '/pingbot.config.json');

