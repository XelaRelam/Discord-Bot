import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const upsertBotData = async (userId: string, botId: string, botData: {
  awaited: boolean;
  invite?: number,
  library?: string,
  description?: string,
  prefix?: string
}) => {
  try {
    await prisma.user.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId }
    });

    await prisma.bot.upsert({
      where: { botId },
      update: {
        invite: botData.invite ?? 0,
        library: botData.library ?? "Unknown",
        description: botData.description ?? "N/A",
        prefix: botData.prefix ?? "/",
        botAwaiting: botData.awaited ?? false
      },
      create: {
        botId,
        userId,
        invite: botData.invite ?? 0,
        library: botData.library ?? "Unknown",
        description: botData.description ?? "N/A",
        prefix: botData.prefix ?? "/",
        botAwaiting: botData.awaited ?? false
      }
    });

    return { success: true, message: "Bot data updated or created successfully." };
  } catch (error) {
    console.error("Error in upserting bot data:", error);
    return { success: false, message: "An error occurred while processing bot data." };
  }
};
