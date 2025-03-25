import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ColorResolvable, AttachmentBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { colorRegex } from '../../types/regex';

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
    ),

  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    logger.debug(`embed: Initiated`);
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ content: 'You do not have permission to use this command.' });
      logger.debug(`embed: User declined`);
    }

    logger.debug(`embed: success`);
    const message = interaction.options.getString('message');
    const mention = interaction.options.getRole('mention');
    const color = interaction.options.getString('color') || '#FFFFFF';
    const title = interaction.options.getString('title');
    const author = interaction.options.getString('author');
    const description = interaction.options.getString('description');
    const footer = interaction.options.getString('footer');
    const inline = interaction.options.getBoolean('inline') ?? false;
    const thumbnail = interaction.options.getBoolean('thumbnail') ?? false;
    const image = interaction.options.getString('image');

    // Validate color (must be a hex code or Discord color string)
    const validColor = colorRegex.test(color) ? (color as ColorResolvable) : '#FFFFFF';

    const fields = [
      {
        name: interaction.options.getString('field-one-name') ?? '',
        value: interaction.options.getString('field-one-content') ?? '',
      },
      {
        name: interaction.options.getString('field-two-name') ?? '',
        value: interaction.options.getString('field-two-description') ?? '', // Notice "description" for field two
      },
      {
        name: interaction.options.getString('field-three-name') ?? '',
        value: interaction.options.getString('field-three-description') ?? '',
      }
    ].filter(f => f.name && f.value); // Remove empty fields

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
    if (fields.length > 0) {
      embed.addFields(fields.map(f => ({ name: f.name, value: f.value, inline })));
      hasEmbedContent = true;
    }

    if (thumbnail && interaction.guild?.iconURL()) {
      embed.setThumbnail(interaction.guild.iconURL({ extension: 'webp', size: 1024 })!);
      hasEmbedContent = true;
    }

    let attachment;
    if (image) {
      const isValidImageURL = image.match(/\.(jpeg|jpg|gif|png|webp)$/i);
      if (isValidImageURL) {
        if (hasEmbedContent) {
          embed.setImage(image);
          hasEmbedContent = true;
        } else {
          attachment = new AttachmentBuilder(image);
        }
      } else {
        return interaction.reply({ content: 'The provided image URL is invalid.', flags: 'Ephemeral'});
      }
      if (hasEmbedContent) {
        embed.setImage(image);
        hasEmbedContent = true;
      } else {
        // Here if its a normal message, than we attach to normal message
      }
    }
    // Build response
    const contentParts: string[] = [];
    if (mention) contentParts.push(`${mention}`);
    if (message) contentParts.push(message);

    if (!contentParts.length && !hasEmbedContent && !attachment) {
      return interaction.reply({ content: 'You must provide at least a message, mention, or embed content.',});
    }

    const replyOptions: any = {
      content: contentParts.length ? contentParts.join(' ') : undefined,
      allowedMentions: { parse: mention ? ['roles'] : [] }
    };

    if (attachment) {
      replyOptions.files = [attachment];
    }

    if (hasEmbedContent) {
      replyOptions.embeds = [embed];
    }

    await interaction.reply(replyOptions);

  }
};
