import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { performance } from 'perf_hooks';
import { logger } from '../../utils';
import { InteractionReturn } from '@/types/interactionReturn';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  async execute(
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
  ):Promise<InteractionReturn> {
    const result:InteractionReturn = {success:true};
    if (!client.isReady()) {
      const result = await interaction.reply('<:Fail:1355193840276869330> Bot is not ready.');
      logger.debug('got /ping request but client is not ready.');
      return {success:false, message:result};
    }

    if (!client.ws) {
      const result = await interaction.reply(`${client.findEmoji('BOT-fail')} Bot is not fully connected to Discord.`);
      logger.debug('got /ping Bot is not fully connected to Discord.');
      return {success:false, message:result};
    }

    const start = performance.now();
    const apiLatency = Math.round(client.ws.ping);

    const latency = Date.now() - interaction.createdTimestamp;
    const message = await interaction.reply(
      `🏓 Pong! Latency: \`${latency}ms\`, `+
      `API Latency: \`${apiLatency}ms\`, `+
      `Roundtrip: \`${Math.round(performance.now() - start)}}ms\``,
    );
    if (result.success) {
      return { success: true, message };
    } else {
      return { success: false };
    }
  },
};
