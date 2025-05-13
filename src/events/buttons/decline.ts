import { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '@/types/extendedClient';
import { hasRole } from '@/middleware/hasRole';
import { getBot, upsertUserData } from '@/database';

export default {
  customId: (id: string): boolean => id.startsWith('decline-'),
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    const [_, botId, userId] = interaction.customId.split('-');
    const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
    const origin = await interaction.message.fetch();
    const messageId = interaction.message.id
    const botData = await getBot(botId);
    const botInfo = client.users.fetch(botId);
    const user = await client.users.fetch(userId);

    if (!(await hasRole(client, interaction.user.id, '1235257572060303480', client.env('DISCORD_GUILD_ID')!))) {
      await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You do not have the right role for this.`});
      return;
    }

    try {

      /* If User has left the server */
      if (!botData.success) {
        await interaction.reply({ content: `${client.findEmoji('BOT-fail')} This Bot was not found in the database.\nCheck if the develop left the server, if this is a error please contact <@705306248538488947>.`, flags: 'Ephemeral'});
        let cancelEmbed = new EmbedBuilder()
          .setTitle('Bot Canceled.')
          .setThumbnail((await botInfo).avatarURL())
          .addFields({
            name: 'Bot Info:',
            value: `<@${botId}> ~ ${botId}\n` + `developer: <@${userId}> ~ userId`
          })
          .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));

        let embed = new EmbedBuilder()
          .setTitle('Bot Canceled.')
          .setThumbnail((await botInfo).avatarURL())
          .setDescription(`User <@${userId}> has left the server and their bot application for <@${(await botInfo).id}> has been Canceled.`)
          .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));

        await origin.edit({embeds: [cancelEmbed],components: []});
        publicChannel.send({content: `<@${userId}>`, embeds: [embed] });    
        const userData = {
          hasAwaitedBot: false,
        };
        upsertUserData(user.id, userData);  
        return;
      }

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
