import { databaseReturn } from '@/types/database';
import { prisma } from '.';

export const getBotInfo = async (
  botId: string,
  property: string,
):Promise<databaseReturn> => {
  try {
    const bot = await prisma.bot.findUnique({
      where: { botId },
    });

    if (!bot) {
      return { success: false, message: 'Bot not found.' };
    }

    if (Object.prototype.hasOwnProperty.call(bot, property)) {
      return { success: true, value: bot[property as keyof typeof bot] };
    } else {
      return {
        success: false,
        message: `Property '${property}' does not exist on the bot.`,
      };
    }
  } catch (error) {
    console.error('Error fetching bot info:', error);
    return { success: false, message: 'An error occurred while fetching bot data.' };
  }
};
