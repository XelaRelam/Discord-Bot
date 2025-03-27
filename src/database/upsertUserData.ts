import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const upsertUserData = async (userId: string, userData: {
  userBanned?: boolean;
  hasAwaitedBot?: boolean;
}) => {
  try {
    const updatedUser = await prisma.user.upsert({
      where: { user_id: userId },
      update: {
        userBanned: userData.userBanned ?? false,
        hasAwaitedBot: userData.hasAwaitedBot ?? false,
      },
      create: {
        user_id: userId,
        userBanned: userData.userBanned ?? false,
        hasAwaitedBot: userData.hasAwaitedBot ?? false,
      }
    });

    return { success: true, message: "User data updated or created successfully.", updatedUser };
  } catch (error) {
    console.error("Error in upserting user data:", error);
    return { success: false, message: "An error occurred while processing user data." };
  }
};
