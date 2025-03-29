import { ExtendedClient } from '../../types/extendedClient';
import { Message, TextChannel } from 'discord.js';
import { prisma } from '../../database';

const STICKY_CHANNELS = new Set(['1266455854811578379']);

export const searchScript = async (
  client: ExtendedClient,
  message: Message
) => {
  if (message.author.bot && message.author.id !== client.user?.id) { // handle sticky If message is sent (not the bot itself)
    if (!STICKY_CHANNELS.has(message.channel.id)) return;
    const channel = message.channel as TextChannel;
    try {
      const lastSticky = await prisma.stickyMessage.findFirst({
        where: { channelID: channel.id },
      });

      /**
       * @description Deletes the last sticky Message
       */
      if (lastSticky) {
        try {
          const lastMessage = await channel.messages.fetch(lastSticky.messageID);
          if (lastMessage && lastMessage.author.id === client.user?.id) {
            await lastMessage.delete();
          }
        } catch (err) {
          console.warn(`⚠️ | Could not delete previous sticky message: ${err}`);
        }
      }

      /**
       * @description Send new message
       */
      const botMessage = await channel.send({
        content: `**__Sticky Message__**\n\n` +
          `> Searching for scripts go to <#1266455854811578379>.\n\n` +
          `> Daily scripts from video, go to <#1301937886546890823>.\n\n` +
          `> Giving suggestions for new content and new scripts, should go there <#1235268079236284416>.\n\n` +
          `**Found any issues?**\nPing **meowscript** for issues and make sure to discuss in <#1235268079236284416>.`
      });

      /**
       * @description Update database to have latest sticky message
       */
      if (lastSticky) {
        await prisma.stickyMessage.update({
          where: { id: lastSticky.id },
          data: { messageID: botMessage.id },
        });
      } else {
        await prisma.stickyMessage.create({
          data: {
            channelID: channel.id,
            messageID: botMessage.id,
          },
        });
      }
    } catch (err) {
      console.error(`❌ | Failed to handle sticky message: ${err}`);
    }
  }
};
