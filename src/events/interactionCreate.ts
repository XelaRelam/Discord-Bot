import { Interaction } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { handleInteraction } from '../bot/handler/interactionHandler';
import { logger } from '../utils';

export default {
  name: 'interactionCreate',
  async execute(interaction: Interaction) {
    const client = interaction.client as ExtendedClient;

    logger.info(`Received interaction: Type=${interaction.type} from ${interaction.user.tag}`);

    await handleInteraction(client, interaction);
  }
};


/* Logging

  if (interaction.isChatInputCommand()) {
    logger.info(`Command Used: ${interaction.commandName} by ${interaction.user.tag} in #${interaction.channel?.toString()}`);
  } else if (interaction.isButton()) {
    logger.info(`Button Clicked: ${interaction.customId} by ${interaction.user.tag}`);
  } else if (interaction.isAnySelectMenu()) {
    logger.info(`Select Menu Used: ${interaction.customId} by ${interaction.user.tag}`);
  } else {
    logger.info(`Other Interaction: Type=${interaction.type} by ${interaction.user.tag}`);
  }

*/
