import { logger } from '../../utils';
import { ExtendedClient } from '../../types/extendedClient';
import { DiscordAPIError, EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const MAX_RETRIES = 3; // Prevent infinite loops

export const handleUserJoin = async (client: ExtendedClient, member: GuildMember, retryCount = 0) => {
  if (member.user.bot) return;

  const welcomeChannel = member.guild.channels.cache.get('1277761468875411520') as TextChannel;
  if (!welcomeChannel) return;

  if (!welcomeChannel.permissionsFor(client.user!)?.has(['SendMessages', 'AttachFiles'])) {
    logger.error("❌ Bot lacks permissions in welcome channel.");
    return;
  }

  const gifPath = join(__dirname, '..', '..', '..', 'content', 'Welcome.gif');
  logger.debug(`📁 Loading GIF from: ${gifPath}`);

  const gifBuffer = readFileSync(gifPath);

  const embed = new EmbedBuilder()
    .setColor('#F9C3CA')
    .setTitle(`Welcome to XelaRelam Community server!`)
    .setDescription(
      `> Read ⁠<#1235205893508042903> to check server-related information and guidelines.\n\n` +
      `> Hangout in <#1235206770532810802>.\n\n` +
      `> Get Support in <#1235243173635428493>.\n\n` +
      `> Check announcements in <#1235206354776489984>.\n\n` +
      `> Get Scripts from <#1284491556392407101>\n\n` +
      `Visit <id:customize> to customize your experience and unlock roles and channels as well (<#1235237608217645290>).\n\n` +
      `You are our **${member.guild.memberCount}th** member and hopefully, you'll enjoy your stay in the server!`
    )
    .setImage('attachment://XelaRelam_Welcome.gif');

  try {
    await welcomeChannel.send({
      content: `<@${member.id}>`,
      embeds: [embed],
      files: [{ attachment: gifBuffer, name: 'XelaRelam_Welcome.gif' }]
    });

    logger.debug(`✅ Successfully sent welcome message to ${member.user.tag}`);
  } catch (err) {
    logger.error(`❌ Failed to send welcome message:`, err);

    if (err instanceof DiscordAPIError) {
      logger.error(`❌ Discord API Error: ${err.message} (Code: ${err.code})`);

      if (err.code === 50001 && retryCount < MAX_RETRIES) {
        logger.warn(`🔁 Welcome failed, Retrying in 5 seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => handleUserJoin(client, member, retryCount + 1), 5000);
      } else {
        logger.error("⛔ Maximum retry attempts reached. Giving up.");
      }
    }
  }
};
