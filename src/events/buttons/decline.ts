import { ButtonInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { hasRole } from '../../middleware/hasRole';
import * as database from './../../database';
import { logger } from '../../utils';

export default {
  customId: (id: string): boolean => id.startsWith('decline-'),
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    const botId = interaction.customId.split('-')[1];
    const userId = interaction.customId.split('-')[2];
    await interaction.deferReply({flags:'Ephemeral'});

    try {
      const origin = await interaction.message.fetch();
      const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
      const botClient = client.users.fetch(botId);
      const botData = await database.getBot(botId);
      const user = await client.users.fetch(userId);
      const guild = await client.guilds.fetch(`${interaction.guildId}`);

      if (!botData.success) {
        await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} This Bot was not found in the database.`});
        return;
      }

      if (!(await hasRole(client, interaction.user.id, '1235257572060303480', client.env('DISCORD_GUILD_ID')!))) {
        await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You do not have the right role for this.`});
        return;
      }

      /**
       * @description Change/Send Embeds
       */
      let botInfoFieldValue =
        `<@${botId}> ~ ${botId}\n` +
        '**Invite:** [Click](https://discord.com/api/oauth2/authorize'+
        `?client_id=${botId}&permissions=0&scope=bot)\n` +
        `**Prefix**: \`${botData.data?.prefix}\`\n` +
        `**Developer**: <@${botData.data?.userId}> ~ ${botData.data?.userId}`;

      if (botData.data?.library) {
        botInfoFieldValue += `\n**Library**: \`${botData.data?.library}\``;
      }

      const embed = new EmbedBuilder()
        .setTitle('Bot declined!')
        .setThumbnail((await botClient).avatarURL())
        .setDescription(
          `<@${userId}>'s bot <@${(await botClient).id}> `+
          `has been declined by <@${interaction.user.id}>.`,
        )
        .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));
      const originEmbed = new EmbedBuilder()
        .setTitle('Bot declined!')
        .setThumbnail((await botClient).avatarURL())
        .addFields(
          {
            name: 'BotInfo',
            value: botInfoFieldValue,
            inline: true,
          },
          {
            name:'Declined By',
            value:
              `<@${interaction.user.id}> ~ ${interaction.user.id}\n`+
              `<t:${Math.round(Date.now() / 1000)}:R>`+
              '~'+
              `<t:${Math.round(Date.now() / 1000)}:d>`,
            inline: true,
          },
        )
        .setColor(parseInt('#FF5151'.replace(/^#/, ''), 16));

      await origin.edit({embeds: [originEmbed],components: []});
      publicChannel.send({ content: `<@${userId}>`, embeds: [embed] });

      const dmEmbed = new EmbedBuilder()
        .setTitle('Bot Declined.')
        .setThumbnail((await botClient).avatarURL())
        .setDescription(
          `Hey <@${user.id}>, `+
          `I'm sorry to say that your bot <@${(await botClient).id}> `+
          `has been declined by <@${interaction.user.id}>.\n`+
          'To know why it was declined please make a ticket in <#1235241560023502889>.',
        )
        .setFooter({text: 'Message send from "XelaRelam".', iconURL: `${guild.iconURL({extension: 'webp', size: 512})}`})
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

      /**
       * @description Database Changes
       */
      const botStats = { awaited: false, added: false };
      const userData = { hasAwaitedBot: false };
      database.upsertBotData(interaction.user.id, botId, botStats);
      database.upsertUserData(interaction.user.id, userData);

      interaction.deleteReply();
      /**
       * @description SendDM
       */
      try{
        await user.send({embeds: [dmEmbed]});
        return;
      } catch (err) {
        logger.debug(`Couldn't send dm to ${user.id}: ${err}`);
        return;
      }

    } catch (err) {
      logger.error(
        '❌ | Error while trying to respond to "resources-*" button interaction.'+
        err,
      );
      interaction.editReply(`${client.findEmoji('BOT-fail')} There was an Internal error while trying to resolve your request, please inform staff.`);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return;

    }
  },
};
