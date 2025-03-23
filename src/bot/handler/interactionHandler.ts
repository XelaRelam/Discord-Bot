import { ExtendedClient } from '@/types/extendedClient';
import { logger } from '@/utils';
import { Client, Interaction } from 'discord.js';

export const handleInteraction = async (client: ExtendedClient, interaction: Interaction) => {
  if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
    logger.info(`Executed command: ${interaction.commandName}`);
  } catch (error) {
    logger.error(`Error executing command: ${interaction.commandName}`, error);
    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
  }
};
