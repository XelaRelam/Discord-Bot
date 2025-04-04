import { Events, MessageReaction, User } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { handleStarboard } from './starboard/main';
import { logger } from '../utils';

export default {
  name: Events.MessageReactionRemove,
  async execute(
    client: ExtendedClient,
    reaction: MessageReaction,
    user: User,
  ):Promise<void> {
    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();
      logger.debug(`Removed a reaction ${reaction.emoji.name}`);

      if (user.bot) return;

      if (reaction.emoji.name === '⭐') {
        await handleStarboard(client, reaction, user);
      }
      return;
    } catch (error) {
      console.error('Error handling star removal:', error);
      return;
    }
  },
};
