import { Events, Message } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { searchScript } from '../events/stickyMessage/searchScript';
import { partnership } from '../events/stickyMessage/partnerships';
import { logger } from '../utils';
import handleThreadUpdate from './thread';

export default {
  name: Events.MessageCreate,
  async execute(
    client: ExtendedClient,
    message: Message,
  ):Promise<void> {
    try {
      if (message.channelId === '1266455854811578379') {
        await searchScript(client, message);
      }
      if (message.channelId === '1235236731461177414') {
        await partnership(client, message);
      }
      if (message.channel.isThread()) {
        await handleThreadUpdate(client, message);
      }
    } catch (error) {
      logger.error('Error handling sticky message:', error);
    }
    return;
  },
};
