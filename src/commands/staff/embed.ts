import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ColorResolvable } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';

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
    ),

  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    logger.info(`embed: Initiated`);
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
      logger.info(`embed: User declined`);
    }
    logger.info(`embed: success`);
    const message = interaction.options.getString('message');
    const mention = interaction.options.getRole('mention');
    const color = interaction.options.getString('color') || '#FFFFFF';
    const title = interaction.options.getString('title');
    const author = interaction.options.getString('author');
    const description = interaction.options.getString('description');
    const footer = interaction.options.getString('footer');
    const inline = interaction.options.getBoolean('inline') ?? false;

    // Validate color (must be a hex code or Discord color string)
    const colorRegex = /^#([0-9A-F]{6})$/i;
    const validColor = colorRegex.test(color) ? (color as ColorResolvable) : '#FFFFFF';

    // Create fields dynamically
    const fields = [];
    for (let i = 1; i <= 3; i++) {
      const name = interaction.options.getString(`field-${i}-name`);
      const value = interaction.options.getString(`field-${i}-description`);
      if (name && value) {
        fields.push({ name, value, inline });
      }
    }

    // Check if an embed is needed
    const embed = new EmbedBuilder().setColor(validColor);
    let hasEmbedContent = false;
    if (title) {
      embed.setTitle(title);
      hasEmbedContent = true;
    }
    if (author) {
      embed.setAuthor({ name: author });
      hasEmbedContent = true;
    }
    if (description) {
      embed.setDescription(description);
      hasEmbedContent = true;
    }
    if (footer) {
      embed.setFooter({ text: footer });
      hasEmbedContent = true;
    }
    if (fields.length) {
      embed.addFields(fields);
      hasEmbedContent = true;
    }

    // Build response
    const contentParts: string[] = [];
    if (mention) contentParts.push(`${mention}`);
    if (message) contentParts.push(message);

    // Ensure at least one of `content` or `embeds` is set
    if (!contentParts.length && !hasEmbedContent) {
      return interaction.reply({ content: 'You must provide at least a message, mention, or embed content.',});
    }

    await interaction.reply({
      content: contentParts.length ? contentParts.join(' ') : undefined,
      embeds: hasEmbedContent ? [embed] : [],
      allowedMentions: { parse: mention ? ['roles'] : [] }
    });
  }
};
