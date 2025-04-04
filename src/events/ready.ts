import { logger } from '@/utils';
import { ExtendedClient } from '@/types/extendedClient';
import { Events } from 'discord.js';
import { EmojiMap } from '@/types/emoji';
import path from 'path';
import fs from 'fs';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: ExtendedClient):Promise<void> {
    logger.info(`✅ | Logged in as ${client.user?.tag}`);

    /**
     * @description Fetch emojis from guild and init emojis collection
     */
    const guild = client.guilds.cache.get(`${client.env('DISCORD_GUILD_ID')}`);
    if (!guild) {
      logger.warn('⚠️ | Guild for emojis not found.');
      return;
    }

    /**
     * @description
     *  ↳ Load static emojis from emojis.json into client.emoji collection
     */
    const emojisPath = path.join(__dirname, '../../src/constants/emojis.json');
    try {
      const emojis: EmojiMap = JSON.parse(fs.readFileSync(emojisPath, 'utf-8'));
      Object.entries(emojis).forEach(([name, emoji]) => {
        client.emoji.set(name, emoji);
      });
      logger.info('✅ | Loaded static emojis from emojis.json');
    } catch (err) {
      logger.error('⚠️ | Failed to load emojis from emojis.json');
      console.error(err);
    }

    /**
     * @description Set Status once the bot is ready
     */
    client.user?.setPresence({
      activities: [{ name: 'Development', type: 3 }],
      status: 'idle',
    });

    logger.info(`🌎 | Connected to ${client.guilds.cache.size} guild(s).`);
    return;
  },
};
