import { ExtendedClient } from '../../types/extendedClient';
import { Message, TextChannel } from 'discord.js';
import { prisma } from '../../database';

const STICKY_CHANNELS = new Set(['1235236731461177414']);

export const searchScript = async (
  client: ExtendedClient,
  message: Message,
):Promise<void> => {
  if ((client.env('ENVIRONMENT')) === 'dev') {
    console.log('L');
    return;
  }
  if (
    !message.author.bot && message.author.id !== client.user?.id
  ) { // handle sticky If message is sent (not the bot itself)
    console.log('1');
    if (!STICKY_CHANNELS.has(message.channel.id)) return;
    console.log('2');
    const channel = message.channel as TextChannel;
    try {
      const lastSticky = await prisma.stickyMessage.findFirst({
        where: { channelID: channel.id },
      });
      console.log('3');

      /**
       * @description Deletes the last sticky Message
       */
      if (lastSticky) {
        try {
          const lastMessage =
            await channel.messages.fetch(lastSticky.messageID);
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
        content: '**Want to partner with us ?**\n\n' +
          '> Check out our https://discord.com/channels/1235165357879328870/1235205893508042903/1237756993620410420 \n\n' +
          '> If you think you meet requirements, straight go to <#1235241560023502889>.\n\n'
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
      return;
    } catch (err) {
      console.error(`❌ | Failed to handle sticky message: ${err}`);
      return;
    }
  }
};
