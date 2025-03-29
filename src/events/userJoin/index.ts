import { ExtendedClient } from '../../types/extendedClient';
import { EmbedBuilder, GuildMember, TextChannel } from 'discord.js';
import { readFileSync } from 'fs';
import { join } from 'path';

export const handleUserJoin = async (client: ExtendedClient, member: GuildMember) => {
  if (member.user.bot) return;

  const welcomeChannel = member.guild.channels.cache.get('1277761468875411520') as TextChannel;
  if (!welcomeChannel) return;

  const gifPath = join(__dirname, '..', '..', '..','content', 'Welcome.gif');
  console.debug(gifPath);
  const gifBuffer = readFileSync(gifPath);

  try {
    const embed = new EmbedBuilder()
      .setColor('#F9C3CA')
      .setTitle(`Welcome to XelaRelam Community server!`)
      .setDescription(
        `> Read ⁠<#1235205893508042903> to check server related information and guidelines as well.\n\n` +
        `> Hangout in <#1235206770532810802>.\n\n` +
        `> Get Support in <#1235243173635428493>.\n\n` +
        `> Check announcements in <#1235206354776489984>.\n\n` +
        `> Get Scripts from <#1235267631188283423>\n\n` +
        `Visit <id:customize> to customize your experience and unlock roles and channels as well (<#1235237608217645290>).\n\n` +
        `You are our **${member.guild.memberCount}th** member and hopefully, you'll enjoy your stay in the server!`
      )
      .setImage('attachment://XelaRelam_Welcome.gif');

    await welcomeChannel.send({
      content: `<@${member.id}>`,
      embeds: [embed],
      files: [{
        attachment: gifBuffer,
        name: 'XelaRelam_Welcome.gif'
      }]
    });

  } catch (err) {
    console.error(`❌ | Failed to send welcome message: ${err}`);
    if (err instanceof Error) {
      console.error('Error stack:', err.stack);
    }
  }
};