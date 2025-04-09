import { ExtendedClient } from "@/types/extendedClient";
import { GuildMember } from "discord.js";
import * as database from '@/database';

export const addUserToDatabase = async (
  client: ExtendedClient,
  member: GuildMember,
):Promise<void> => {
  try {
    await database.prisma.user.upsert({
      where: { user_id: member.id },
      update: { hasLeftServer: false },
      create: {
        user_id: member.id,
        createdAt: new Date(),
        userBanned: false,
        hasAwaitedBot: false,
      },
    });
  } catch (err) {
    console.error(`Failed to insert user ${member.id}:`, err);
  }
  return;

}