import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { InteractionReturn } from '@/types/interactionReturn';
import * as database from '@/database';

export default {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates JavaScript code (dev only))')
    .addStringOption(option => option
      .setName('code')
      .setDescription('Code to evaluate.')
      .setRequired(true),
    ),

  async execute(
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
  ):Promise<InteractionReturn> {
    logger.debug('eval: Initiated');

    const allowedUserIds = ['705306248538488947', '1152694512829866065'];

    if (!allowedUserIds.includes(interaction.user.id)) {
      const message = await interaction.reply({ content: `${client.findEmoji('BOT-fail')} You do not have permission to use this command.`, flags: 'Ephemeral'});
      return {success:true, message};
    }

    const code = interaction.options.getString('code', true);

    try {
      const result = await (async () => eval(code))();

      const resultOutput = result instanceof Promise ? await result : result;

      const output = typeof resultOutput === 'string' ? resultOutput : JSON.stringify(resultOutput, null, 2);

      logger.debug(`eval: Success, result: ${output}`);

      const message = await interaction.reply({
        content: `\`\`\`js\n${output}\n\`\`\``,
      });
      return {success:true, message};
    } catch (error) {
      logger.error(`eval: Error occurred while evaluating code: ${error}`);
      const message = await interaction.reply({
        content: `Error: \`\`\`js\n${error}\n\`\`\``,
      });
      return {success:false, message};
    }
  },
};
