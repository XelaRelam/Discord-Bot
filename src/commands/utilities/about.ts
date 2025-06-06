import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { EmbedBuilder } from '@discordjs/builders';
import { InteractionReturn } from '@/types/interactionReturn';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Get info on this bot!'),

  async execute(
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
  ):Promise<InteractionReturn> {
    const Embed = new EmbedBuilder()
      .setTitle(`${client.user.username} information:`)
      .setDescription('This bot is made for "XelaRelam Community" by [Lynnux](https://discord.com/users/705306248538488947).')
      .addFields(
        {
          name: '❯ Build',
          value: 'V1.7.1',
          inline: true,
        },
        {
          name: '❯ Developer',
          value: '@dark-lynn',
          inline: true,
        },
        {
          name: '❯ Dev Website',
          value: '['+ '[Click Me](https://lynnux.xyz/)' + ']',
        },
      )
      .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));
    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setURL('https://github.com/XelaRelam/Discord-Bot')
          .setLabel('Source')
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setURL('https://lynnux.xyz/#contact')
          .setLabel('Contact Developer')
          .setStyle(ButtonStyle.Link),
      );
    const message = await interaction.reply({
      embeds: [Embed],
      components: [row],
    });
    return {success:true, message};
  },
};
