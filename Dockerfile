FROM node:18

ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update && \
		apt-get install -y \
			ffmpeg \
			wcanadian

WORKDIR /app/pingbot

COPY package.json /app/pingbot

RUN yarn install

ADD . .

RUN yarn build

CMD ["node", "dist/main.js"]
