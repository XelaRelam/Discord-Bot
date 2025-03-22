import { ChatInputCommandInteraction } from 'discord.js';

export interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: ChatInputCommandInteraction<'cached'>) => Promise<void>;
}
