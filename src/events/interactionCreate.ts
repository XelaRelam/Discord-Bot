import { Interaction } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { buttonHandler, handleInteraction } from '../bot/handler';
import { logger } from '../utils';

export default {
  name: 'interactionCreate',
  async execute(client: ExtendedClient, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      logger.debug(`❔ | Received interaction: Type=${interaction.type} from ${interaction.user.tag}`);
      await handleInteraction(client, interaction);
    } else if (interaction.isButton()) {
      await buttonHandler(client, interaction);
    }
  }
};
