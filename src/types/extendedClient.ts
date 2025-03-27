import { Client, Collection } from 'discord.js';
import { Command } from './commands';
import { Button } from './buttons';
import dotenv from 'dotenv';

dotenv.config();

export class ExtendedClient extends Client<true> {
  readonly commands: Collection<string, Command>;
  readonly subcommands: Collection<string, Command>;
  readonly buttons: Collection<string, Button>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection();
    this.subcommands = new Collection();
    this.buttons = new Collection();
  }

  env(key: string): string | undefined {
    return process.env[key];
  }
}
