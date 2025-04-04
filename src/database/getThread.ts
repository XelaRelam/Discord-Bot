import { logger } from '../utils';
import { prisma } from '../database';
import { databaseReturn } from '@/types/database';

export const getThread = async (threadId: string):Promise<databaseReturn> => {
  try {
    const thread = await prisma.thread.findUnique({
      where: { threadId },
    });

    if (!thread) {
      return { success: false, message: 'Thread not found' };
    }

    return { success: true, data: thread };
  } catch (error) {
    logger.error('Error retrieving bot data:', error);
    if (error instanceof Error) {
      console.log('Error Stack:' + error.stack);
    }
    return { success: false, message: 'An error occurred while retrieving thread data' };
  }
};
