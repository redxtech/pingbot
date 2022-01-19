# pingbot
> the em*bot*iment of a shitpost.

## features

### chance-based
For each message that is sent, there is (configurable) chance that pingbot will:
 - ping @everyone (the original feature, how it got it's name)
 - react with a random emoji (often eerily in-tune to the mood of the message)
 - set your nickname to a string of random characters (most fun when on a server where users can't change their own
     nicknames)
 - send you a random insult through dms
 - replying with an ascii chad face
 - one more secret bonus feature you'll have to wait and find out (spoilers in source code)

### pingbot love
if you send a message that shows appreciation for pingbot (if it matches this regex:
`/(\b(i\b.+\b(love|like|appreciate))|(thanks))\b.+\bping\s*bot\b/`), pingbot will respond with a heart to show it's appreciation of you.

additionally, if you send a message that shows dislike for pingbot (if it matches this regex:
`/(\bi\b.+\b(hate|dislike)\b.+\bping\s*bot\b)|(\bping\s*bot\b.+\b(sucks|is\b.+\b(bad|garbage|trash|ass|shit|the worst))\b)|(\bfuck\b.+\bping\s*bot\b)|(\bping\s*bot (suck|eat|munche)s dick|cock\b)/`),
pingbot will respond with a sad face that will randomly switch between forwards and backwards.

### o o f
if you send a message that contains the word 'o o f' (any whitespace, including none), pingbot will do one of two things:
 - if you are in a voice channel, pingbot will join your voice channel, play the roblox *oof* sound, and leave.
 - if you are not in a voice channel, pingbot will simply reply 'o o f' instead.
 - there is also a monkey sound that is played for 'oo oo aa aa'

### birthday
if you send a message that contains the word birthday, pingbot will react with the first emoji on the server
with birthday in its name

### dms
if you send a dm to pingbot, he will respond by telling you to get out of his dms, he has a girlfriend already.


## configuration
if you are a server owner, you (and anyone else with `MANAGER_SERVER` permissions) can use the `/pingbot <name> <value>`
to set the probabilities of each chance-based feature (autocompleted). additionally, you can view the current probabilities
and reset them to default with `/pingbot-probabilities` & `/pingbot-reset` resepectively.

if you are are the host, you can set the default probabilities in the `config.ts` file, but the server oweners
will be able to override this with the aforementioned command

## options
all options and configuration is done through `config.ts`.

you need to specify a bot token with the `token` key. the bot will not run without this.

you can configure how often pingbot will perform it's actions (a one in `x` chance of performing the action) with these
config keys:
 - `probabilities.ping` chance of pingbot pinging everyone (default: `10000`).
 - `probabilities.react` chance of pingbot reacting to messages (default: `100`).
 - `probabilities.nickname` chance of pingbot changeing someone's nickname (default: `1000`).
 - `probabilities.dm` chance of pingbot sending you an insulting dm (defaults: `1000`)
 - `probabilities.chad` chance of pingbot responding with the chad face (default: `1000`)

## setup
setup is simple:
 1. clone the bot.
 2. install the dependencies with `yarn` (or `npm install`). if either of these commands don't work, you need to install
 [node][2].
 3. create a bot user & invite it to your server (follow [this guide][1], but use the code in this repo as the bot's
 code).
 4. create a `config.ts` file and set `token` equal to the token obtained in the previous step (`export const token = '<token>'`).
 5. add your desired options to the `config.ts` file.
 6. run the bot with `yarn start` (or `npm run start`). alternatively you can run it with `node ./src/index.js`.
 7. enjoy!

[1]: https://www.howtogeek.com/364225/how-to-make-your-own-discord-bot/
[2]: https://nodejs.org

note: if you want the 'o o f' function to work in the voice channels, you need to install ffmpeg.

### personal recommendation
when creating the bot user, you are most likely going to want to choose an image for pingbot to use as a profile
picture. my personal favourite is shown below with two variations: normal and pinged (the better choice). i
recommend these because they perfectly capture the essence of the bot, and they were the pinged variation was
the server icon of the server this bot was written for.

![pingbot pinged][pinged]
![pingbot][boring]

[pinged]: resources/pingbot.png
[boring]: resources/pingbot-boring.png

## author
**pingbot** © [gabe dunn](https://github.com/redxtech), released under the [MIT](./license.md) license.
