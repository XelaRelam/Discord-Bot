import { logger } from '../utils';
import { ExtendedClient } from '../types/extendedClient';
import { Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ExtendedClient) {
    logger.info(`✅ | Logged in as ${client.user?.tag}`);
    client.user?.setPresence({
      activities: [{ name: 'Development', type: 3 }],
      status: 'idle',
    });

    logger.info(`🌎 | Connected to ${client.guilds.cache.size} guild(s).`);
  },
};
