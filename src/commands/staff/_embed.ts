import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ColorResolvable, AttachmentBuilder, GuildMember, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { colorRegex, isValidImageURL } from '../../types/regex';
import { botHasEmbedPerms, botHasSendPerms, botHasViewPerms } from '../../middleware/permissions';

export default async function handleEmbed(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
  const ROLE_ID = '1354193758010212423';
  const channel = client.channels.cache.get(interaction.channelId) as TextChannel;
  if (!interaction.member || !(interaction.member instanceof GuildMember)) {
    return await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} Could not verify your roles.`});
  }

  if (!botHasSendPerms(client, channel) || !botHasEmbedPerms(client, channel) || !botHasViewPerms(client, channel)) {
    return await interaction.editReply({content: `${client.findEmoji('BOT-fail')} I do not have the right permissions for this channel, please inform staff.`});
  }

  const hasRole = interaction.member.roles.cache.has(ROLE_ID);

  if (!hasRole) {
    return await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You do not have permission to use this command.` });
  }

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
    if (isValidImageURL) {
      if (hasEmbedContent) {
        embed.setImage(image);
        hasEmbedContent = true;
      } else {
        attachment = new AttachmentBuilder(image);
      }
    } else {
      return await interaction.editReply({ content: `${client.findEmoji('BOT-fail')} The provided image URL is invalid.`});
    }
  }

  // Build response
  const contentParts: string[] = [];
  if (mention) contentParts.push(`${mention}`);
  if (message) contentParts.push(message);

  if (!contentParts.length && !hasEmbedContent && !attachment) {
    return interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You must provide at least a message, mention, or embed content.`,});
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

  await channel.send(replyOptions);

  interaction.editReply(`${client.findEmoji('BOT-check')} Message has been send to <#${channel.id}>`);
}
