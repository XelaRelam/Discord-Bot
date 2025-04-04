import * as database from '@/database';
import { ExtendedClient } from "@/types/extendedClient";
import { InteractionReturn } from "@/types/interactionReturn";
import { logger } from '@/utils';
import { ChatInputCommandInteraction } from "discord.js";

export async function handleDebugDatabaseGet(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
): Promise<InteractionReturn> {
  const model = interaction.options.getString('model', true);
  const id = interaction.options.getString('id', true);
  let result: any;

  try {
    switch (model) {
      case 'user':
        result = await database.prisma.user.findUnique({
          where: { user_id: id },
          include: { bots: {select: {botId: true}} }
        });
        break;
      case 'bot':
        result = await database.prisma.bot.findUnique({
          where: { botId: id },
          include: { threads: {select: {threadId: true}} }
        });
        break;
      case 'thread':
        result = await database.prisma.thread.findUnique({
          where: { threadId: id },
          include: { bots: {select: {botId: true}} }
        });
        break;
      case 'starboard':
        result = await database.prisma.starboard.findUnique({ where: { messageId: id } });
        break;
      case 'sticky-message':
        result = await database.prisma.stickyMessage.findUnique({ where: { channelID: id } });
        break;
      default:
        await interaction.editReply({ content: 'Invalid model.'});
        return {success:false};
    }

    if (result) {
      if (Array.isArray(result.bots)) {
        result.bots = result.bots.map((b: { botId: string }) => b.botId);
      }
      if (Array.isArray(result.threads)) {
        result.threads = result.threads.map((t: { threadId: string }) => t.threadId);
      }
      await interaction.editReply({
        content: `\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``,
      });
    }
  } catch (err) {
    logger.error(err);
    await interaction.editReply({ content: 'An error occurred while fetching data.'});
    return {success:false};
  }
  return {success: true}
}

export async function handleDebugDatabaseDelete(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
): Promise<InteractionReturn> {
  const model = interaction.options.getString('model', true);
  const id = interaction.options.getString('id', true);

  try {
    switch (model) {
      case 'user':
        await database.prisma.user.delete({ where: { user_id: id } });
        break;
      case 'bot':
        await database.prisma.bot.delete({ where: { botId: id } });
        break;
      case 'thread':
        await database.prisma.thread.delete({ where: { threadId: id } });
        break;
      case 'starboard':
        await database.prisma.starboard.delete({ where: { messageId: id } });
        break;
      case 'sticky-message':
        await database.prisma.stickyMessage.delete({ where: { channelID: id } });
        break;
      default:
        await interaction.editReply({ content: 'Invalid model.' });
        return { success: false };
    }
    await interaction.editReply({ content: `Successfully deleted entry \`${id}\` from \`${model}\`.` });
  } catch (err) {
    logger.error(err);
    await interaction.editReply({ content: 'An error occurred while processing your request.' });
    return { success: false };
  }

  return { success: true };
}

export async function handleDebugDatabaseSet(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
): Promise<InteractionReturn> {
  const model = interaction.options.getString('model', true);
  const id = interaction.options.getString('id', true);
  const field = interaction.options.getString('field', true);
  let value: any = interaction.options.getString('value', true);
  let updateData: any = {};
  let result: any;

  if (field === 'userBanned') {
    value = value === 'true';
  } else if (!isNaN(Number(value))) {
    value = Number(value);
  }

  try {
    switch (model) {
      case 'user':
        updateData = { [field]: value };
        result = await database.prisma.user.update({
          where: { user_id: id },
          data: updateData,
        });
        break;
      case 'bot':
        updateData = { [field]: value };
        result = await database.prisma.bot.update({
          where: { botId: id },
          data: updateData,
        });
        break;
      case 'thread':
        updateData = { [field]: value };
        result = await database.prisma.thread.update({
          where: { threadId: id },
          data: updateData,
        });
        break;
      case 'starboard':
        updateData = { [field]: value };
        result = await database.prisma.starboard.update({
          where: { messageId: id },
          data: updateData,
        });
        break;
      case 'sticky-message':
        updateData = { [field]: value };
        result = await database.prisma.stickyMessage.update({
          where: { channelID: id },
          data: updateData,
        });
        break;
      default:
        await interaction.editReply({ content: 'Invalid model.' });
        return { success: false };
    }
    if (!result) {
      await interaction.editReply({ content: `No entry found for \`${id}\` in \`${model}\`.` });
    } else {
      await interaction.editReply({ content: `Successfully updated entry \`${id}\` in \`${model}\`.` });
    }
  } catch (err) {
    logger.error(err);
    await interaction.editReply({ content: 'An error occurred while processing your request.' });
    return { success: false };
  }
  return { success: true };
}
