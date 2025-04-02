import { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { ComponentBuilder, EmbedBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder()
    .setName('thread-create')
    .setDescription('test (dev only)'),

  async execute(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
    logger.debug(`eval: Initiated`);

    const allowedUserIds = ['705306248538488947', '1152694512829866065'];

    if (!allowedUserIds.includes(interaction.user.id)) {
      return interaction.reply({ content: `${client.findEmoji('BOT-fail')} You do not have permission to use this command.`, flags: 'Ephemeral'});
    }

    try {
      const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
      const embed = new EmbedBuilder()
        .setTitle('Create a Private Thread for Your Bot')
        .setFooter({ text: 'Threads are deleted after 24 hours of inactivity.' })
        .setDescription('Click the button below to create a private thread with your bot.')
        .setColor(parseInt('#00ffff'.replace(/^#/, ''), 16));
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`thread-create`)
            .setLabel('Create Thread')
            .setStyle(ButtonStyle.Primary),
        );

      channel.send(({components: [row], embeds: [embed]}));

    } catch (error) {
      logger.error(`eval: Error occurred while evaluating code: ${error}`);
      return interaction.reply({
        content: `Error: \`\`\`js\n${error}\n\`\`\``,
      });
    }
  }
};
