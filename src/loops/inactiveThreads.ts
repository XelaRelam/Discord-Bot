import { ExtendedClient } from '../types/extendedClient';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils';
import { ThreadChannel } from 'discord.js';

const prisma = new PrismaClient();

export default (client: ExtendedClient) => {
  const checkInactiveThreads = async () => {
    const now = Date.now();
    const inactiveThreads = await prisma.thread.findMany({
      where: {
        lastActive: {
          lt: new Date(now - 24 * 60 * 60 * 1000),
        },
      },
    });

    for (const thread of inactiveThreads) {
      const discordThread = await client.channels.fetch(thread.threadId) as ThreadChannel;
      if (discordThread) {
        await discordThread.delete('Thread inactive for 24 hours');
        await prisma.thread.delete({
          where: { threadId: thread.threadId },
        });
        logger.debug(`❌ Deleted inactive thread: ${thread.threadId}`);
      }
    }
  };


  setInterval(() => checkInactiveThreads(), 30 * 60 * 1000);
};
