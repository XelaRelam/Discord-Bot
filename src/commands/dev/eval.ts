import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';

export default {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluates JavaScript code (dev only))')
    .addStringOption(option => option
      .setName('code')
      .setDescription('Code to evaluate.')
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    logger.debug(`eval: Initiated`);

    const allowedUserIds = ['705306248538488947', '1152694512829866065'];

    if (!allowedUserIds.includes(interaction.user.id)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', flags: 'Ephemeral'});
    }

    const code = interaction.options.getString('code', true);

    try {
      const result = await eval(code);

      const resultOutput = result instanceof Promise ? await result : result;

      const output = typeof resultOutput === 'string' ? resultOutput : JSON.stringify(resultOutput, null, 2);

      logger.debug(`eval: Success, result: ${output}`);

      return interaction.reply({
        content: `\`\`\`js\n${output}\n\`\`\``,
      });
    } catch (error) {
      logger.error(`eval: Error occurred while evaluating code: ${error}`);
      return interaction.reply({
        content: `Error: \`\`\`js\n${error}\n\`\`\``,
      });
    }
  }
};
