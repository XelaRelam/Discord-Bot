import { Client, Collection } from 'discord.js';
import { Command } from './commands';

export class ExtendedClient extends Client<true> {
  readonly commands: Collection<string, Command>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
  }
}
