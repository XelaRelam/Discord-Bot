import { prisma } from ".";

export const upsertUserData = async (userId: string, userData: {
  userBanned?: boolean;
  hasAwaitedBot?: boolean;
}) => {
  try {
    const updateData: any = {};

    if (userData.userBanned !== undefined) updateData.userBanned = userData.userBanned;
    if (userData.hasAwaitedBot !== undefined) updateData.hasAwaitedBot = userData.hasAwaitedBot;

    const updatedUser = await prisma.user.upsert({
      where: { user_id: userId },
      update: updateData,
      create: {
        user_id: userId,
        userBanned: userData.userBanned ?? false,
        hasAwaitedBot: userData.hasAwaitedBot ?? false,
      },
    });

    return { success: true, message: "User data updated or created successfully.", updatedUser };
  } catch (error) {
    console.error("Error in upserting user data:", error);
    return { success: false, message: "An error occurred while processing user data." };
  }
};
