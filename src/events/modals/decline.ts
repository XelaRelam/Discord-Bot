import { ModalSubmitInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '@/types/extendedClient';
import * as database from '@/database';
import { Bot } from '@/types/database';

export default {
  customId: (id: string): boolean => id.startsWith('decline-'),
  async execute(
    client: ExtendedClient,
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
  /**
   * @description Define starting vars.
   */
    const [, messageId, bot_Id, userId] = interaction.customId.split('-');
    const reason = interaction.fields.getTextInputValue('reason');
    const user = await client.users.fetch(userId);
    const bot = await client.users.fetch(bot_Id);
    const guild = await client.guilds.fetch(`${interaction.guildId}`);
    const botData = await database.getBot(bot.id);

  /**
   * @description Check if we can find the channel.
   */
    const channelId = interaction.message?.channelId;
    if (!channelId) {
      await interaction.reply({ content: 'No channel found.', flags: 'Ephemeral' });
      return;
    }

  /**
   * @description edit old embed.
   */

    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({ content: 'The channel is not valid or not text-based.', flags: 'Ephemeral' });
        return;
      }

      const botInfo = botData.data as Bot;
      let botInfoFieldValue =
        `<@${bot_Id}> ~ ${bot_Id}\n` +
        '**Invite:** [Click](https://discord.com/api/oauth2/authorize'+
        `?client_id=${bot_Id}&permissions=0&scope=bot)\n` +
        `**Prefix**: \`${botInfo?.prefix}\`\n` +
        `**Developer**: <@${botInfo?.userId}> ~ ${botInfo?.userId}`;

      if (botInfo?.library) {
        botInfoFieldValue += `\n**Library**: \`${botInfo?.library}\``;
      }

      const message = await channel.messages.fetch(messageId);
      const newEmbed = new EmbedBuilder()
        .setTitle('Bot declined!')
        .setThumbnail(bot.avatarURL())
        .addFields(
          {
            name: 'BotInfo',
            value: botInfoFieldValue,
            inline: true,
          },
          {
            name: 'Reviewed by:',
            value:
              `<@${interaction.user.id}> ~ ${interaction.user.id}\n`+
              `<t:${Math.round(Date.now() / 1000)}:R>`+
              '~'+
              `<t:${Math.round(Date.now() / 1000)}:d>`,
            inline: true
          },
          {
            name: 'Reason of decline:',
            value: `**${reason}**`,
            inline: false
          }
        )
        .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));

      await message.edit({ embeds: [newEmbed], components: [] });

    } catch {
      await interaction.reply({ content: 'Failed to edit the original message.', flags: 'Ephemeral' });
      return;
    }

  /**
   * @description Send message in public log.
   */
    const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
    const embed = new EmbedBuilder()
      .setTitle('Bot declined!')
      .setThumbnail(bot.avatarURL())
      .setDescription(
        `<@${userId}>'s bot <@${bot.id}> `+
        `has been declined by <@${interaction.user.id}>.`,
      )
      .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));

    publicChannel.send({ content: `<@${userId}>`, embeds: [embed] });
  /**
   * @description Send Embed to user DM
   */
    try {
      const dmEmbed = new EmbedBuilder()
        .setTitle('Bot Declined.')
        .setThumbnail(bot.avatarURL())
        .setDescription(
          `Hey <@${user.id}>,\n`+
          `your bot <@${bot_Id}> was declined by <@${interaction.user.id}>.\n\n`+
          '**Reason for decline:**'+
          `\`\`\`${reason}\`\`\``,
        )
        .setFooter({text: 'Message send from "XelaRelam".', iconURL: `${guild.iconURL({extension: 'webp', size: 512})}`})
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

      await user.send({ embeds: [dmEmbed] });
    } catch {
      await interaction.reply({ content: 'Failed to send DM to user.', flags: 'Ephemeral'});
    }
  /**
   * @description Remove the bot from the database.
   */

    try {
      await database.prisma.bot.delete({
        where: { botId: bot_Id },
      })

      const userData = {
        hasAwaitedBot: false,
      };
      database.upsertUserData(user.id, userData);

      await interaction.reply({ content: 'The bot has been declined and deleted from the database.', flags: 'Ephemeral' });
    } catch (err) {
      console.error('Error deleting bot from database:', err);
      await interaction.reply({ content: 'Failed to delete bot in database.', flags: 'Ephemeral' });
    }
  return;
  }
};
