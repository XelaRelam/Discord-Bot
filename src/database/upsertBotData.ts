import { logger } from '..//utils';
import { prisma } from '.';

export const upsertBotData = async (userId: string, botId: string, botData: {
  awaited: boolean;
  added?: boolean;
  invite?: number;
  library?: string;
  description?: string;
  prefix?: string;
  approvedBy?: string;
  addedAt?: Date;
}) => {
  try {
    // Ensure the user exists
    await prisma.user.upsert({
      where: { user_id: userId },
      update: {},
      create: { user_id: userId }
    });

    const updateData: any = {};

    if (botData.invite !== undefined) updateData.invite = botData.invite;
    if (botData.library !== undefined) updateData.library = botData.library;
    if (botData.description !== undefined) updateData.description = botData.description;
    if (botData.prefix !== undefined) updateData.prefix = botData.prefix;
    if (botData.awaited !== undefined) updateData.botAwaiting = botData.awaited;
    if (botData.added !== undefined) updateData.botAdded = botData.added;
    if (botData.addedAt !== undefined) updateData.addedAt = botData.addedAt;
    if (botData.approvedBy !== undefined) updateData.approvedBy = botData.approvedBy;

    // Upsert bot data
    await prisma.bot.upsert({
      where: { botId },
      update: updateData,
      create: {
        botId,
        userId,
        invite: botData.invite ?? 0,
        library: botData.library ?? "Unknown",
        description: botData.description ?? "N/A",
        prefix: botData.prefix ?? "/",
        botAwaiting: botData.awaited ?? false,
        botAdded: botData.added ?? false,
        addedAt: botData.addedAt ?? new Date(),
        approvedBy: botData.approvedBy ?? 'Unknown',
      },
    });

    logger.debug(updateData);
    return { success: true, message: "Bot data updated or created successfully." };
  } catch (error) {
    console.error("Error in upserting bot data:", error);
    return { success: false, message: "An error occurred while processing bot data." };
  }
};
