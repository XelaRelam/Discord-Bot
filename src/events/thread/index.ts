import { ExtendedClient } from "../../types/extendedClient";
import { Message, ThreadChannel } from "discord.js";
import { prisma } from "../../database";
import { logger } from "../../utils";

export default async function handleThreadUpdate(client: ExtendedClient, message: Message) {
  if (!message.channel.isThread()) return;

  const thread = message.channel as ThreadChannel;

  try {
    const existingThread = await prisma.thread.findUnique({
      where: { threadId: thread.id }
    });

    if (existingThread) {
      await prisma.thread.update({
        where: { threadId: thread.id },
        data: { lastActive: new Date() }
      });

      logger.debug(`✅ Updated lastActive for thread ${thread.id}`);
    }
  } catch (error) {
    logger.error(`❌ Error updating thread ${thread.id}:`, error);
  }
}
