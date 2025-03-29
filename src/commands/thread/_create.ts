import { ExtendedClient } from "../../types/extendedClient";
import { ChatInputCommandInteraction, TextChannel, ThreadAutoArchiveDuration } from "discord.js";
import { prisma } from '../../database';
import { hasPerms } from "../../middleware/hasChannelPerms";

export default async function handleThreadCreate(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
  const botUser = interaction.options.getUser('bot', true);
  const guild = await client.guilds.fetch(`${client.env(`DISCORD_GUILD_ID`)}`);
  const parentChannel = client.channels.cache.get('1235262698044788872') as TextChannel;

  if (!botUser.bot) {
    return interaction.editReply({ content: `${client.findEmoji('BOT-fail')} You must mention a valid bot user.` });
  }

  try {
    await guild.members.fetch(botUser.id);
  } catch (error) {
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} You must mention a valid bot user that is in this server.`
    });
  }

  const botHasPermissions = await hasPerms(client, botUser.id, parentChannel, ['SendMessagesInThreads', 'ViewChannel']);
  if (!botHasPermissions) {
    return interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot does not have the necessary permissions please inform staff.`});
  }

  const clientHasPermissions = await hasPerms(client, client.user.id, parentChannel, ['ManageThreads', 'SendMessagesInThreads', 'ViewChannel', 'ReadMessageHistory']);
  if (!clientHasPermissions) {
    return interaction.editReply({content: `${client.findEmoji('BOT-fail')} I do not have the necessary permissions to manage threads in this channel.`});
  }

  const existingThread = await prisma.thread.findFirst({
    where: { userId: interaction.user.id, botId: botUser.id }
  });

  if (existingThread) {
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} You already have a thread for this bot!`
    });
  }

  if (!parentChannel || !parentChannel.isTextBased()) {
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} Could not find the correct channel for bot threads.`
    });
  }

  try {
    const thread = await parentChannel.threads.create({
      name: `${interaction.user.username}'s bot`,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      type: 12,
      reason: `${interaction.user.username} created bot thread for ${botUser.username}`
    });

    await thread.members.add(interaction.user.id);
    await thread.members.add(botUser.id);

    await prisma.thread.create({
      data: {
        threadId: thread.id,
        userId: interaction.user.id,
        botId: botUser.id,
        createdAt: new Date(),
        lastActive: new Date()
      }
    });

    return interaction.editReply({
      content: `${client.findEmoji('BOT-check')} Your bot thread has been created: <#${thread.id}>`
    });
  } catch (error) {
    console.error("❌ Error creating thread:", error);
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} There was an error creating your bot thread.`
    });
  }
}
