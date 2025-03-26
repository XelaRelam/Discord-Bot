import { Events, Message } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { searchScript } from '../events/stickyMessage/searchScript';
import { logger } from '../utils';

export default {
  name: Events.MessageCreate,
  async execute(client: ExtendedClient, message: Message) {
    try {
      logger.info(`got ${message.content} in ${message.channelId}`);
      if (message.channelId === '1266455854811578379') {
        await searchScript(client, message);
      }
    } catch (error) {
      logger.error('Error handling sticky message:', error);
    }
  },
};
