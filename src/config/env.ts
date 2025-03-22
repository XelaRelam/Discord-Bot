import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

if (!process.env.DISCORD_BOT_TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN is not defined in .env file');
}

export const env = {
  botToken: process.env.DISCORD_BOT_TOKEN!,
  clientId: process.env.DISCORD_CLIENT_ID!,
  guildId: process.env.DISCORD_GUILD_ID!,
};
