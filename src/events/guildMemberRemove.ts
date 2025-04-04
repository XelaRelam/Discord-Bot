import { Events, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { logger } from '../utils';
import * as database from '@/database';

export default {
  name: Events.GuildMemberRemove,
  async execute(
    client: ExtendedClient,
    member: GuildMember,
  ):Promise<void> {
    logger.debug(`❔ | User Leave ${member.id}`);

    try {
    /**
     * @description Fetch user from database
     */
      const user = await database.prisma.user.findUnique({
        where: { user_id: member.id },
        include: { bots: true }
      });

      if (!user || user.bots.length === 0) {
        logger.debug(`ℹ️ | No bots to clean up for user ${member.id}`);
        return;
      }

    /**
     * @description Remove bot entries
     */
      for (const bot of user.bots) {
        try {
          const botMember = await member.guild.members.fetch(bot.botId).catch(() => null);
          if (botMember) {
            await botMember.kick('Bot owner left the server');
            logger.debug(`👢 | Kicked bot ${bot.botId} owned by ${member.id}`);
          } else {
            logger.debug(`⚠️ | Bot ${bot.botId} not found in guild`);
          }

          // Remove the bot from the database
          await database.prisma.bot.delete({
            where: { botId: bot.botId }
          });
        } catch (botError) {
          logger.error(`Failed to kick/delete bot ${bot.botId}: ${botError}`);
        }
      }
      logger.debug(`✅ | Cleaned up bots for user ${member.id}`);
    } catch (err) {
      logger.error(`Error when user left. ${err}`);
      if (err instanceof Error) {
        console.log(`Error Stack: ${err.stack}`);
      }
    }
    return;
  },
};
