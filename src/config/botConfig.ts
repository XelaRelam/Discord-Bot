import { ActivityType } from "discord.js";
import { env } from "./env";

export const botConfig = {
  token: env.botToken || '',
  clientId: env.clientId || '',
  guildId: env.guildId || '',
  prefix: '!',
  embedColor: 0x5865f2,
  activity: {
    name: 'with TypeScript',
    type: ActivityType.Playing
  },
};
