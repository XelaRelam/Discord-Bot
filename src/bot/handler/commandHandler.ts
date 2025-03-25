import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import fs from 'fs';
import path from 'path';

export const loadCommands = async (client: ExtendedClient) => {
  const commandsPath = path.join(__dirname, '../../commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

      for (const file of commandFiles) {
        const commandPath = path.join(folderPath, file);
        const command = (await import(commandPath)).default;

        if (command && command.data && command.execute) {
          client.commands.set(command.data.name, command);
          logger.info(`Loaded command: ${command.data.name}`);

          if (command.data.options) {
            for (const option of command.data.options) {
              if (option.type === 1 || option.type === 2) { // 1 = Subcommand, 2 = Subcommand Group
                client.subcommands.set(`${command.data.name}/${option.name}`, command);
                logger.info(`Loaded subcommand: ${command.data.name}/${option.name}`);
              }
            }
          }
        } else {
          logger.warn(`Skipping invalid command file: ${file}`);
        }
      }
    } else if (folder === 'index.ts') {
      logger.warn(`Skipping invalid command file: ${folder}`);
    }
  }
};
