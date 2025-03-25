import { Interaction } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { handleInteraction } from '../bot/handler/interactionHandler';
import { logger } from '../utils';

export default {
  name: 'interactionCreate',
  async execute(client: ExtendedClient, interaction: Interaction) {
    logger.debug(`❔ | Received interaction: Type=${interaction.type} from ${interaction.user.tag}`);
    await handleInteraction(client, interaction);
  }
};
