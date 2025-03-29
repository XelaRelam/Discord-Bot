import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import handleThreadCreate from './_create';

export default {
  data: new SlashCommandBuilder().setName('bot-channel').setDescription('Manage your bots thread.')
    .addSubcommand(subCommand => subCommand
      .setName('create')
      .setDescription('Create a custom thread for your bot.')
      .addUserOption(option => option
        .setName('bot')
        .setDescription('The bot your making this thread for.')
        .setRequired(true)
      )
    ),
  async execute(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({flags: "Ephemeral"});
    try {
      if (!(interaction.user.id === '705306248538488947') && true) {
        return interaction.editReply({ content: `${client.findEmoji('BOT-fail')} This command is disabled at this moment.` });
      }

      if (interaction.options.getSubcommand() === 'create') {
        handleThreadCreate(client, interaction);
      }
    } catch (err) {
      logger.error(`❌ | Error while trying to respond to "${interaction.commandName}.${interaction.options.getSubcommand()}" interaction. ${err}`);
      interaction.editReply(`${client.findEmoji('BOT-fail')} There was an Internal error while trying to resolve your request, please inform staff.`);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return;
    }
  }
};
