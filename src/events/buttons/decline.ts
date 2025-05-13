import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';
import { ExtendedClient } from '@/types/extendedClient';
import { hasRole } from '@/middleware/hasRole';
import { getBot } from '@/database';

export default {
  customId: (id: string): boolean => id.startsWith('decline-'),
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    const [_, botId, userId] = interaction.customId.split('-');
    const messageId = interaction.message.id
    const botData = await getBot(botId);

    if (!(await hasRole(client, interaction.user.id, '1235257572060303480', client.env('DISCORD_GUILD_ID')!))) {
      await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You do not have the right role for this.`});
      return;
    }

    /* If User has left the server */
    if (!botData) {
      const newEmbed = new EmbedBuilder()
        .setTitle('Bot Canceled!')
        .setThumbnail('https://cdn.lynnux.xyz/images/No-Server_Icon-found.png')
        .addFields(
          {
            name: `Reason For Cancellation`,
            value: `Developer has left the server.`,
            inline: false
          }
        )
        .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));
    };

    try {
      const modal = new ModalBuilder()
        .setCustomId(`decline-${messageId}-${botId}-${userId}`)
        .setTitle('Decline Bot - Reason');

      const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Reason for declining:')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter the reason for declining this bot.')
        .setRequired(true);

      const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
      modal.addComponents(actionRow);

      await interaction.showModal(modal);
    } catch {
      await interaction.deferReply({flags: 'Ephemeral'})
      await interaction.editReply({
        content:
          `${client.findEmoji('fail')} `+
          `Something went wrong when showing a modal. `+
          `please inform staff about this issue.`,
      })
      return;
    }
  },
};
