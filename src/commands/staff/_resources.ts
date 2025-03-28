import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { botHasEmbedPerms, botHasSendPerms, botHasViewPerms } from '../../middleware/permissions';

export default async function handleResources(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
  const userIds = ['1152694512829866065', '745974902514909243', '705306248538488947'];
  const channel = client.channels.cache.get('1280972854862545008') as TextChannel;

  if (!userIds.includes(interaction.user.id)) {
    await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You do not have permission to run this command`});
    return;
  }

  if (!botHasSendPerms(client, channel) || !botHasEmbedPerms(client, channel) || !botHasViewPerms(client, channel)) {
    return interaction.editReply({content: `${client.findEmoji('BOT-fail')} I do not have the right permissions for this channel, please inform staff.`});
  }

  /**
   * @description Button Row
   */
  const firstRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`resources-packages-${interaction.user.id}`)
        .setLabel('📦 Packages')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`resources-databases-${interaction.user.id}`)
        .setLabel('Databases')
        .setEmoji('<:Server:1355158578289442907>')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`resources-web-${interaction.user.id}`)
        .setLabel('🌐 Web')
        .setStyle(ButtonStyle.Secondary),
    );
  const secondaryRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`resources-javascript-${interaction.user.id}`)
        .setLabel('JavaScript')
        .setEmoji('<:Javascript:1355158184905408633>')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`resources-python-${interaction.user.id}`)
        .setLabel('Python')
        .setEmoji('<:Python:1355159215450095787>')
        .setStyle(ButtonStyle.Secondary),
    );
  const thirdRow = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(`resources-bdfd-${interaction.user.id}`)
        .setLabel('BDFD')
        .setEmoji('<:BDFD:1355158736574091486>')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`resources-aoijs-${interaction.user.id}`)
        .setLabel('Aoi.js')
        .setEmoji('<:AoiJs:1355158925141344659>')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId(`resources-botForge-${interaction.user.id}`)
        .setLabel('BotForge')
        .setEmoji('<:BotForge:1355159055097925672>')
        .setStyle(ButtonStyle.Secondary),
    );

  /**
   * @description Embed
   */
  const embed = new EmbedBuilder()
    .setTitle('Welcome to Server Resources!')
    .setDescription('Here we have compiled a comprehensive list of websites, youtube channels, and documentation to help you get started with programming. We have varied resources depending on your experience level so everyone has something to learn. Feel free to ask for help as per usual if you need clarification <3')
    .setColor(parseInt('#A020F0'.replace(/^#/, ''), 16))
    .setTimestamp(new Date());

  await channel.send({ embeds: [embed], components: [firstRow, secondaryRow, thirdRow] });
  await interaction.editReply({content: `${client.findEmoji('BOT-check')} Embed has been send to <#${channel.id}>`});
}
