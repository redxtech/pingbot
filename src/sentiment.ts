import { Message } from 'discord.js'
import Sentiment from 'sentiment'
import { nou } from './strings'
import { selectFrom, sendMessage, should } from './utils'

// uno reverse images
const replies = [
	nou,
	'https://i.imgur.com/t1M9ffQ.gif',
	'https://i.imgur.com/b3Yz5Qj.png',
	'https://i.imgur.com/wa24eIx.gif',
	'https://i.imgur.com/ejWUm1R.jpg',
	'https://i.imgur.com/UMyQx52.png',
	'https://i.imgur.com/aEBqGuU.jpg',
	'https://i.imgur.com/AoETXik.jpg'
]

// come up with a response
const pickResponse = (message: string, score: number, pos: Array<string>, neg: Array<string>, words: Array<string>): string | undefined => {
	// only run it one in x times
	// TODO make probability configurable
	if  (should(1)) {
		// handle only positive and negative messages
		if (score > 0) {
			// positive sentiment
			if (pos.includes('amazing')) {
				// repay compliment of amazing
				return 'no, you\'re amazing 😊'
			} else if (pos.includes('love')) {
				// respond to pingbot love
				return 'heart <3'
			} else {
				// respond to general positivity with badly drawn grin
				return '<:badly_drawn_grin:928966787813490699>'
			}
		} else if (score < 0) {
			// negative sentiment
			if (neg.includes('shit')) {
				return ''
			} else if (neg.includes('love')) {
				return 'well at least my parents loves me'
			} else if (words.includes('gay')) {
				return selectFrom(replies)
			} else {
				return '<:badly_drawn_sob:928963473977790474>'
			}
		} else {
			// respond to being called gay with no u
			if  (words.includes('gay')) {
				return selectFrom(replies)
			}
		}
	} else {
		// still handle these when chance fails
		if (/i love pingbot/.test(message)) {
			return 'heart <3'
		} else if (/i hate pingbot/.test(message)) {
			return ':\'('
		}
	}
}

// the thing handler function for sentience responding
export const sentience = (message: Message): void => {
	// analyze the sentiment of the message
	const sentiment = new Sentiment()
	const analysis = sentiment.analyze(message.content)

	// pick a response
	const response = pickResponse(message.content, analysis.score, analysis.positive, analysis.negative, analysis.tokens)

	// if response is undefined, don't send the messsage
	if (response) {
		return sendMessage(message, response)
	}
}

