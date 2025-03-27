import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const upsertBotData = async (userId: string, botId: string, botData: {
  awaited: boolean,
  added?: boolean,
  invite?: number,
  library?: string,
  description?: string,
  prefix?: string,
  addedAt?: Date
}) => {
  try {
    // Ensure the user exists
    await prisma.user.upsert({
      where: { user_id: userId },
      update: {}, // No update to user data, just ensure user exists
      create: { user_id: userId } // Create user if it doesn't exist
    });

    // Upsert bot data
    await prisma.bot.upsert({
      where: { botId },
      update: {
        invite: botData.invite ?? 0,
        library: botData.library ?? "Unknown",
        description: botData.description ?? "N/A",
        prefix: botData.prefix ?? "/",
        botAwaiting: botData.awaited ?? false,
        botAdded: botData.added ?? false,
        addedAt: botData.addedAt ?? new Date() // Make sure `addedAt` has a default if not provided
      },
      create: {
        botId,
        userId,
        invite: botData.invite ?? 0,
        library: botData.library ?? "Unknown",
        description: botData.description ?? "N/A",
        prefix: botData.prefix ?? "/",
        botAwaiting: botData.awaited ?? false,
        botAdded: botData.added ?? false,
        addedAt: botData.addedAt ?? new Date() // Ensure `addedAt` has a default if not provided
      }
    });

    return { success: true, message: "Bot data updated or created successfully." };
  } catch (error) {
    console.error("Error in upserting bot data:", error);
    return { success: false, message: "An error occurred while processing bot data." };
  }
};
