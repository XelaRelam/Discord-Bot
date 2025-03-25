import { PrismaClient } from '@prisma/client';
import { ExtendedClient } from '../../types/extendedClient';
import { MessageReaction, PartialMessageReaction, PartialUser, TextChannel, User } from 'discord.js';
import { logger } from '../../utils';

const prisma = new PrismaClient();
const STAR_THRESHOLD = 1;
const STARBOARD_CHANNEL_ID = '1252185956291842181';

export const handleStarboard = async (
  client: ExtendedClient,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.partial) await user.fetch();

    const { message } = reaction;
    if (!message.channel) {
      logger.warn('Message channel is undefined. Skipping starboard processing.');
      return;
    }

    if (!message.author || message.author.id === user.id) return; // Prevent self-starring
    if (reaction.emoji.name !== '⭐') return; // Only track ⭐ reactions

    const starboardChannel = client.channels.cache.get(STARBOARD_CHANNEL_ID) as TextChannel
      ?? await client.channels.fetch(STARBOARD_CHANNEL_ID).catch(() => null);

    if (!starboardChannel || !starboardChannel.isTextBased()) {
      logger.warn('Starboard channel not found.');
      return;
    }

    // Fetch existing starboard entry
    let starboardEntry = await prisma.starboard.findUnique({
      where: { messageId: message.id }
    });

    // Count stars
    const starCount = message.reactions?.cache.get('⭐')?.count || 0;

    if (starboardEntry) {
      // If entry exists, update or delete
      if (starCount < STAR_THRESHOLD) {
        // Remove from starboard
        const starboardMsg = starboardEntry?.starboardId
          ? await starboardChannel.messages.fetch(starboardEntry.starboardId).catch(() => null)
          : null;

        if (starboardMsg) await starboardMsg.delete();
        await prisma.starboard.delete({ where: { messageId: message.id } });
      } else {
        // Update star count in the database
        await prisma.starboard.update({
          where: { messageId: message.id },
          data: { starsCount: starCount }
        });

        // Edit existing starboard message
        const starboardMsg = starboardEntry?.starboardId
          ? await starboardChannel.messages.fetch(starboardEntry.starboardId).catch(() => null)
          : null;
        if (starboardMsg) {
          await starboardMsg.edit(`⭐ **${starCount}** - [Jump to message](<${message.url}>)`);
        }
      }
    } else if (starCount >= STAR_THRESHOLD) {
      // If it's a new starboard entry
      const starMsg = await starboardChannel.send({
        content: `⭐ **${starCount}** - [Jump to message](<${message.url}>)`,
        embeds: [
          {
            author: {
              name: message.author?.tag || 'Unknown',
              icon_url: message.author ? message.author.displayAvatarURL() : undefined,
            },
            description: message.content || '*No text content*',
            color: 0xFFD700,
            timestamp: new Date().toISOString(),
          },
        ],
      });

      // Save to database
      await prisma.starboard.create({
        data: {
          messageId: message.id,
          starboardId: starMsg.id,
          channelId: message.channel.id,
          authorId: message.author.id,
          starsCount: starCount
        }
      });
    }
  } catch (error) {
    logger.error('Error in starboard system:', error);
  }
};
