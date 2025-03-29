import { prisma } from ".";

export const getBot = async (botId: string) => {
  try {
    const bot = await prisma.bot.findUnique({
      where: { botId },
    });

    if (!bot) {
      return { success: false, message: 'Bot not found' };
    }

    return { success: true, data: bot };
  } catch (error) {
    console.error('Error retrieving bot data:', error);
    return { success: false, message: 'An error occurred while retrieving bot data' };
  }
};
