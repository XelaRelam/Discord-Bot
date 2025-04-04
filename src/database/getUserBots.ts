import { prisma } from './index';

export const getUserBots = async (userId: string):Promise<any> => {
  const userWithBots = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { bots: true },
  });

  return userWithBots?.bots ?? [];
};
