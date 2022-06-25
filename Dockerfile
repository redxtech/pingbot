FROM node:latest

ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update && \
		apt-get install -y wcanadian


# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN yarn install

VOLUME ["/usr/src/bot/node_modules"]

COPY . /usr/src/bot

RUN yarn build

# Start the bot.
CMD ["node", "dist/src/main.js"]
