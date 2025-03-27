import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { performance } from 'perf_hooks';
import { logger } from '../../utils';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
    if (!client.ws) {
      await interaction.reply('Bot is not fully connected to Discord.');
      logger.debug('got /ping Bot is not fully connected to Discord.');
      return;
    }

    if (!client.isReady()) {
      await interaction.reply('Bot is not ready.');
      logger.debug('got /ping request but client is not ready.');
      return;
    }

    const start = performance.now();
    const apiLatency = Math.round(client.ws.ping);

    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`🏓 Pong! Latency: \`${latency}ms\`, API Latency: \`${apiLatency}ms\`, Roundtrip: \`${Math.round(performance.now() - start)}ms\``);
  }
};
