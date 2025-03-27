import { Client, PermissionFlagsBits, TextChannel } from 'discord.js';

/**
 * Checks if the bot has admin permissions in a given channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to check.
 * @returns {boolean} - True if the bot has admin permissions, otherwise false.
 */
export const botHasAdminPerms = (client: Client, channelId: string): boolean => {
  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (!channel) return false;

  const botMember = channel.guild.members.me;
  if (!botMember) return false;

  return botMember.permissionsIn(channel).has(PermissionFlagsBits.Administrator);
};

/**
 * Checks if the bot has SendMessages permissions in a given channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to check.
 * @returns {boolean} - True if the bot has SendMessages permissions, otherwise false.
 */
export const botHasSendPerms = (client: Client, channel: TextChannel): boolean => {
  if (!channel) return false;

  const botMember = channel.guild.members.me;
  if (!botMember) return false;

  return botMember.permissionsIn(channel).has(PermissionFlagsBits.SendMessages);
};

/**
 * Checks if the bot has EmbedLinks permissions in a given channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to check.
 * @returns {boolean} - True if the bot has EmbedLinks permissions, otherwise false.
 */
export const botHasEmbedPerms = (client: Client, channel: TextChannel): boolean => {
  if (!channel) return false;

  const botMember = channel.guild.members.me;
  if (!botMember) return false;

  return botMember.permissionsIn(channel).has(PermissionFlagsBits.EmbedLinks);
};

/**
 * Checks if the bot has ReadMessageHistory permissions in a given channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to check.
 * @returns {boolean} - True if the bot has ReadMessageHistory permissions, otherwise false.
 */
export const botHasHistoryPerms = (client: Client, channel: TextChannel): boolean => {
  if (!channel) return false;

  const botMember = channel.guild.members.me;
  if (!botMember) return false;

  return botMember.permissionsIn(channel).has(PermissionFlagsBits.ReadMessageHistory);
};

/**
 * Checks if the bot has ViewChannel permissions in a given channel.
 * @param client - The Discord bot client.
 * @param channelId - The ID of the channel to check.
 * @returns {boolean} - True if the bot has ViewChannel permissions, otherwise false.
 */
export const botHasViewPerms = (client: Client, channel: TextChannel): boolean => {
  if (!channel) return false;

  const botMember = channel.guild.members.me;
  if (!botMember) return false;

  return botMember.permissionsIn(channel).has(PermissionFlagsBits.ViewChannel);
};