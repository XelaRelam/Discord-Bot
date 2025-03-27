import { ButtonInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { hasRole } from '../../middleware/hasRole';
import * as database from './../../database';

export default {
  customId: (id: string) => id.startsWith('approve-'),
  async execute(client: ExtendedClient, interaction: ButtonInteraction) {
    const botId = interaction.customId.split('-')[1];
    const userId = interaction.customId.split('-')[2];
    const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
    let botInfo = client.users.fetch(botId);
    const origin = await interaction.message.fetch();
    const botData = await database.getBot(botId);

    if (!botData.success) {
      return interaction.reply({ content: `This Bot was not found in the database.`, flags: "Ephemeral"});
    }

    if (!(await hasRole(client, interaction.user.id, '1235257572060303480', client.env('DISCORD_GUILD_ID')!))) {
      return interaction.reply({ content: `You do not have the right role for this.`, flags: "Ephemeral"});
    }

    /**
     * @description Embeds
     */
    let botInfoFieldValue =
      `<@${botId}> ~ ${botId}\n` +
      `**Invite:** [Click](https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=0&scope=bot)\n` +
      `**Prefix**: \`${botData.data?.prefix}\`\n` +
      `**Developer**: <@${botData.data?.userId}> ~ ${botData.data?.userId}`;

    if (botData.data?.library) {
      botInfoFieldValue += `\n**Library**: \`${botData.data?.library}\``;
    }

    const embed = new EmbedBuilder()
      .setColor(parseInt('#75FF70'.replace(/^#/, ''), 16))
      .setTitle('Bot Approved!')
      .setDescription(`<@${userId}>'s bot <@${botId}> has been approved by <@${interaction.user.id}>`)
      .setThumbnail((await botInfo).avatarURL());
    const originEmbed = new EmbedBuilder()
      .setTitle('Bot approved!')
      .setThumbnail((await botInfo).avatarURL())
      .addFields(
        {
          name: `BotInfo`,
          value: botInfoFieldValue,
          inline: true
        },
        {
          name:`Approved By`,
          value:
            `<@${interaction.user.id}> ~ ${interaction.user.id}\n`+
            `<t:${Math.round(Date.now() / 1000)}:R> ~ <t:${Math.round(Date.now() / 1000)}:d>`,
          inline: true
        }
      )
      .setColor(parseInt('#75FF70'.replace(/^#/, ''), 16));

    await origin.edit({embeds: [originEmbed],components: []});
    publicChannel.send({ embeds: [embed] });

    /**
     * @description Database Update
     */
    const botStats = {
      awaited: false,
      added: true
    };
    database.upsertBotData(interaction.user.id, botId, botStats);

    const userData = {
      hasAwaitedBot: false,
    };
    database.upsertUserData(interaction.user.id, userData);
  },
};
