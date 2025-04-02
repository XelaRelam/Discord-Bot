import { prisma } from './index';

export const getUserBots = async (userId: string) => {
  const userWithBots = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { bots: true },
  });

  return userWithBots?.bots ?? [];
};
