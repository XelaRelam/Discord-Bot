import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import handleResources from './_resources';
import handleEmbed from './_embed';

export default {
  data: new SlashCommandBuilder()
    .setName('staff')
    .setDescription('Commands only for staff members')
    .addSubcommand(subCommand => subCommand
      .setName('embed')
      .setDescription('Generate a message or embed (staff)')
      .addStringOption(option => option.setName('message').setDescription('What should the normal message be.').setRequired(false))
      .addRoleOption(option => option.setName('mention').setDescription('Which role to mention.').setRequired(false))
      .addStringOption(option => option.setName('color').setDescription('The color of the embed. (default is white)').setRequired(false))
      .addStringOption(option => option.setName('title').setDescription('The title of the embed.').setRequired(false))
      .addStringOption(option => option.setName('author').setDescription('The embed author (above the title)').setRequired(false))
      .addStringOption(option => option.setName('description').setDescription('The description of the embed.').setRequired(false))
      .addStringOption(option => option.setName('footer').setDescription('The footer of the embed.').setRequired(false))
      .addBooleanOption(option => option.setName('inline').setDescription('If the fields should show inline').setRequired(false))
      .addStringOption(option => option.setName('field-one-name').setDescription('The name of field one.').setRequired(false))
      .addStringOption(option => option.setName('field-one-content').setDescription('The description of field one.').setRequired(false))
      .addStringOption(option => option.setName('field-two-name').setDescription('The name of field two.').setRequired(false))
      .addStringOption(option => option.setName('field-two-description').setDescription('The description of field two.').setRequired(false))
      .addStringOption(option => option.setName('field-three-name').setDescription('The name of field three.').setRequired(false))
      .addStringOption(option => option.setName('field-three-description').setDescription('The description of field three.').setRequired(false))
      .addBooleanOption(option => option.setName('thumbnail').setDescription('If true will show the server icon as thumbnail.').setRequired(false))
      .addStringOption(option => option.setName('image').setDescription('An image to display in the embed or message.').setRequired(false))
    )
    .addSubcommand(subCommand => subCommand
      .setName('resources')
      .setDescription('Generate a message or embed (staff)')
    ),
  async execute(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({flags: "Ephemeral"});
    try {
      if (interaction.options.getSubcommand() === 'resources') {
        await handleResources(client, interaction);
      } else if (interaction.options.getSubcommand() === 'embed') {
        await handleEmbed(client, interaction);
      }
    } catch (err) {
      logger.error(`❌ | Error while trying to respond to "staff embed" interaction. ${err}`);
      interaction.editReply(`${client.findEmoji('BOT-fail')} There was an Internal error while trying to resolve your request, please inform staff.`);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return;
    }
  }
};
