import { ExtendedClient } from '../types/extendedClient';
import { prisma } from '@/database';
import { logger } from '../utils';
import { ThreadChannel } from 'discord.js';

export default (client: ExtendedClient):Promise<void> => {
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
      const discordThread =
        await client.channels.fetch(thread.threadId) as ThreadChannel;
      if (discordThread) {
        await discordThread.delete('Thread inactive for 24 hours');
        await prisma.thread.delete({
          where: { threadId: thread.threadId },
        });
        logger.debug(`❌ Deleted inactive thread: ${thread.threadId}`);
      }
    }
  };

  const startChecking = async () => {
    setInterval(() => checkInactiveThreads(), 30 * 60 * 1000);
  };

  startChecking();

  return Promise.resolve();
};
