import { ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from './extendedClient';

export interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: ChatInputCommandInteraction<'cached'>, client: ExtendedClient) => Promise<void>;
}
