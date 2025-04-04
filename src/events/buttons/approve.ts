import { ButtonInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { hasRole } from '../../middleware/hasRole';
import * as database from './../../database';
import { logger } from '../../utils';

export default {
  customId: (id: string): boolean => id.startsWith('approve-'),
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    const botId = interaction.customId.split('-')[1];
    const userId = interaction.customId.split('-')[2];
    try {
      const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
      const botInfo = client.users.fetch(botId);
      const origin = await interaction.message.fetch();
      const botData = await database.getBot(botId);
      const guild = await client.guilds.fetch(`${interaction.guildId}`);
      const user = await client.users.fetch(userId);

      if (!botData.success) {
        await interaction.reply({ content: `${client.findEmoji('BOT-fail')} This Bot was not found in the database.`, flags: 'Ephemeral'});
        return;
      }

      if (!(await hasRole(client, interaction.user.id, '1235257572060303480', client.env('DISCORD_GUILD_ID')!))) {
        await interaction.reply({ content: `${client.findEmoji('BOT-fail')} You do not have the right role for this.`, flags: 'Ephemeral'});
        return;
      }

      /**
       * @description Embeds
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

      const dmEmbed = new EmbedBuilder()
        .setTitle('Bot Approved.')
        .setThumbnail((await botInfo).avatarURL())
        .setDescription(
          `Hey <@${userId}>,`+
          `I'm delighted to say that your bot <@${botId}> `+
          'has been approved.',
        )
        .setFooter({text: 'Message send from "XelaRelam".', iconURL: `${guild.iconURL({extension: 'webp', size: 512})}`})
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

      const embed = new EmbedBuilder()
        .setColor(parseInt('#75FF70'.replace(/^#/, ''), 16))
        .setTitle('Bot Approved!')
        .setDescription(
          `<@${userId}>'s bot <@${botId}> `+
          `has been approved by <@${interaction.user.id}>`,
        )
        .setThumbnail((await botInfo).avatarURL());
      const originEmbed = new EmbedBuilder()
        .setTitle('Bot approved!')
        .setThumbnail((await botInfo).avatarURL())
        .addFields(
          {
            name: 'BotInfo',
            value: botInfoFieldValue,
            inline: true,
          },
          {
            name:'Approved By',
            value:
              `<@${interaction.user.id}> ~ ${interaction.user.id}\n`+
              `<t:${Math.round(Date.now() / 1000)}:R>`+
              ' ~ '+
              `<t:${Math.round(Date.now() / 1000)}:d>`,
            inline: true,
          },
        )
        .setColor(parseInt('#75FF70'.replace(/^#/, ''), 16));

      await origin.edit({embeds: [originEmbed],components: []});
      publicChannel.send({content: `<@${userId}>`, embeds: [embed] });

      /**
       * @description Database Update
       */
      const botStats = {
        awaited: false,
        added: true,
        approvedBy: `${interaction.user.id}`,
      };
      database.upsertBotData(user.id, botId, botStats);

      const userData = {
        hasAwaitedBot: false,
      };
      database.upsertUserData(user.id, userData);


      try{
        await user.send({embeds: [dmEmbed]});
        return;
      } catch (err) {
        logger.debug(`Couldn't send dm to ${user.id}: ${err}`);
        return;
      }

    } catch (err) {
      logger.error(
        '❌ | Error while trying to respond to "resources-*" button interaction. '+
        err,
      );
      interaction.editReply(
        `${client.findEmoji('BOT-fail')}`+
        'There was an Internal error while trying to resolve your request, please inform staff.',
      );
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return;
    }
  },
};
