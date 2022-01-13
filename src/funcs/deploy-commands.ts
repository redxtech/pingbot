import { Snowflake } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { token } from '../../config'
import { defaults } from '../db'

export const deployCommands = (clientId: Snowflake | undefined, guildId: Snowflake | null): Promise<unknown> => {
	// array of commands
	const commands = [
		new SlashCommandBuilder()
			.setName('pingbot')
			.setDescription('Configure pingbot')
			.addStringOption(option => 
				option
					.setName('name')
					.setDescription('the name of the probability to set')
					.addChoices(Object.keys(defaults).filter(n => n !== 'rolled').map(k => [k, k]))
					.setRequired(true)
			)
			.addIntegerOption(option =>
				option
					.setName('value')
					.setDescription('1 in x probability')
					.setMinValue(1)
					.setRequired(true)
			),
		new SlashCommandBuilder()
			.setName('pingbot-reset')
			.setDescription('reset all probabilities to default')
	].map(command => command.toJSON())

	// create a rest request to the api
	const rest = new REST({ version: '9' }).setToken(token);

	// if clientID and guildId are valid, put the commands to the command route
	if (clientId && guildId) {
		return rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	} else {
		throw new Error('Invalid client and/or message ID')
	}
}

