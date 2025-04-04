import { ButtonInteraction, EmbedBuilder, TextChannel, ThreadAutoArchiveDuration } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { hasPerms } from '../../middleware/hasChannelPerms';
import { prisma } from '../../database';

export default {
  customId: 'thread-create',
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    await interaction.deferReply({flags: 'Ephemeral'});
    const parentChannel = client.channels.cache.get('1235262698044788872') as TextChannel;
    const userBots = await prisma.user.findUnique({
      where: { user_id: interaction.user.id },
      include: { bots: true },
    });

    if (!userBots || userBots.bots.length === 0) {
      await interaction.editReply({ content: 'You have no bots to associate with this thread.' });
      return;
    }

    for (const bot of userBots.bots) {
      const botHasPermissions =
      await hasPerms(client, bot.botId, parentChannel,
        [
          'SendMessagesInThreads',
          'ViewChannel',
        ],
      );

      if (!botHasPermissions) {
        await interaction.editReply({
          content: `${client.findEmoji('BOT-fail')} One or more of your bots do not have the necessary permissions. Please inform staff.`,
        });
        return;
      }
    }

    const clientHasPermissions = await hasPerms(client, client.user.id, parentChannel, ['ManageThreads', 'SendMessagesInThreads', 'ViewChannel', 'ReadMessageHistory']);
    if (!clientHasPermissions) {
      await interaction.editReply({content: `${client.findEmoji('BOT-fail')} I do not have the necessary permissions to manage threads in this channel.`});
      return;
    }

    const existingThread = await prisma.thread.findFirst({
      where: { userId: interaction.user.id },
    });

    if (existingThread) {
      await interaction.editReply({
        content: `${client.findEmoji('BOT-fail')} You already have a thread for your bot(s)!`,
      });
      return;
    }

    if (!parentChannel || !parentChannel.isTextBased()) {
      await interaction.editReply({
        content: `${client.findEmoji('BOT-fail')} Could not find the correct channel for bot threads.`,
      });
      return;
    }

    try {
      const thread = await parentChannel.threads.create({
        name: `${interaction.user.username}'s bot`,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
        type: 12,
        reason:
          `${interaction.user.username} created bot thread`+
          `for their ${userBots.bots.length} bot(s).`,
      });

      await thread.members.add(interaction.user.id);
      for (const bot of userBots.bots) {
        await thread.members.add(bot.botId);
      }

      const embed = new EmbedBuilder()
        .setTitle('New Channel Created!')
        .setDescription(
          'Your thread has been made and your bot(s) have been added.\n'+
          `Your thread is <#${thread.id}>.`,
        )
        .setFooter({text: 'Threads are deleted after 24h of inactivity.'})
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

      interaction.editReply({embeds: [embed]});

      setImmediate(async () => {
        await prisma.thread.create({
          data: {
            threadId: thread.id,
            userId: interaction.user.id,
            createdAt: new Date(),
            lastActive: new Date(),
            bots: {
              connect: userBots.bots.map((bot) => ({ botId: bot.botId })),
            },
          },
        });
      });
      return;
    } catch (error) {
      console.error('❌ Error creating thread:', error);
      await interaction.editReply({
        content: `${client.findEmoji('BOT-fail')} There was an error creating your bot thread.`,
      });
      return;
    }
  },
};
