import { ExtendedClient } from '../types/extendedClient';
import { GatewayIntentBits, Partials } from 'discord.js';
import { botConfig } from '../config/botConfig';
import { loadEvents } from './handler/eventHandler';
import { loadCommands } from './handler/commandHandler';
import { logger } from '../utils';

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.User,
    Partials.ThreadMember,
    Partials.Reaction,
    Partials.Message,
    Partials.GuildScheduledEvent
  ]
});

client.once('ready', () => {
  if (client.user) {
    client.user.setActivity(botConfig.activity.name, {
      type: botConfig.activity.type,
    });
    logger.info(`Logged in as ${client.user.tag}!`);
  }
});

(async () => {
  await loadEvents(client);
  await loadCommands(client);
})();

client.login(botConfig.token).catch((error) => {
  logger.error('Failed to log in:', error);
});