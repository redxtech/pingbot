import { Interaction, Permissions } from 'discord.js'
import { hostId, clientID } from '../config';
import { defaults, getProb, resetProb, setProb } from './db';
import { upCase } from './utils';

// function to handle slash commands
export const slashHandler = async (interaction: Interaction): Promise<void> => {
  // only handle slash command interactions
	if (!interaction.isCommand()) return;

  // we need the command name
	const { commandName } = interaction;

  // this is the only command for now
	if (commandName === 'pingbot') {
    // get the subcommand
    const subCommandName = interaction.options.getSubcommand()

    if (subCommandName === 'config') {
      if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
        // pull the values from the options
        const name = interaction.options.get('name')?.value as string
        const value = interaction.options.get('value')?.value as number

        // and the guild ID
        const guildId = interaction.guildId

        // save the setting to the database
        setProb({ guildId, name, value })

        // respond to the message
        await interaction.reply({ content: `Probability updated - ${name}: ${value}.`, ephemeral: true });
      }
    } else if (subCommandName === 'reset') {
      if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
        // remove entries from database
        resetProb(interaction.guildId)

        // respond to the message
        await interaction.reply({ content: 'Probabilities reset!', ephemeral: true})
      }
    } else if (subCommandName === 'show') {
      if (interaction.memberPermissions?.has(Permissions.FLAGS.MANAGE_GUILD) || interaction.user.id === hostId) {
        // get the guild ID
        const guildId = interaction.guildId

        //  grab all the values from the db
        const keys = Object.keys(defaults)

        // accumulate probabilities into an array
        const probabilities = []
        for (const k of keys) {
          probabilities.push(`${k}: ${await getProb(guildId, k)}`)
        }

        // respond to the message
        interaction.reply({ content: `**Probabilities for ${interaction.guild?.name}:**\n` + probabilities.map(p => upCase(p)).join('\n'), ephemeral: true })
      }
    } else if (subCommandName === 'invite') {
			interaction.reply({
				content: `https://discord.com/api/oauth2/authorize?client_id=${clientID}&permissions=8&scope=bot%20applications.commands`,
				ephemeral: true
			})
		}
  }
}
