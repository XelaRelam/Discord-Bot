import { ExtendedClient } from "@/types/extendedClient";
import { InteractionReturn } from "@/types/interactionReturn";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import * as database from '@/database';

export default async function handleAssign(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
):Promise<InteractionReturn> {
  const user = interaction.options.getMember('user') as GuildMember;
  const role = interaction.options.getRole('position');
  const guild = interaction.guild;

  if (!user || !role || !guild) {
    const message = await interaction.editReply('Please provide a valid user and position to assign.');
    return { success: false, message };
  }
  const normalizedRole = role.name;

  /**
   * @description Check and update database
   */
  let staffMember = await database.prisma.user.findUnique({
    where: {
      user_id: user.id,
    },
    include: {
      staffMember: true,
    },
  });
  if (!staffMember) {                       // If user is not in db yet
    staffMember = await database.prisma.user.create({
      data: {
        user_id: user.id,
        createdAt: new Date(),
        userBanned: false,
        hasAwaitedBot: false,
        hasLeftServer: false,
        staffMember: {
          create: {
            totalRating: 0,
            ratingCount: 0,
          },
        },
      },
      include: {
        staffMember: true,
      },
    });
  } else if (!staffMember.staffMember) {    // If user exist but doesn't have staffMember yet
    const newStaff = await database.prisma.staffMember.create({
      data: {
        userId: staffMember.user_id,
        totalRating: 0,
        ratingCount: 0,
      },
    });

    staffMember = {
      ...staffMember,
      staffMember: newStaff,
    };
  }

  /**
   * @description Check if user already assigned that role.
   */
  const positionExists = await database.prisma.staffPosition.findFirst({
    where: {
      staffMemberId: staffMember.staffMember?.id,
      name: role.name,
    },
  });

  if (positionExists) {
    const message = await interaction.reply(`The user is already assigned to the "${normalizedRole}" position.`);
    return {success: false, message}
  }

  await database.prisma.staffPosition.create({
    data: {
      name: role.name,
      staffMemberId: staffMember.staffMember?.id as string,
    },
  });

  user.roles.add(role.id)
  const message = await interaction.reply(`${user.displayName} has been assigned the position "${normalizedRole}".`);

  return { success: true, message }
}