import { ExtendedClient } from '@/types/extendedClient';
import fs from 'fs';
import path from 'path';

export const loadCommands = async (client: ExtendedClient) => {
  const commandsPath = path.join(__dirname, '../../commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.ts'));

      for (const file of commandFiles) {
        const commandPath = path.join(folderPath, file);
        const command = (await import(commandPath)).default;
        if (command && command.data && command.execute) {
          client.commands.set(command.data.name, command);
          console.log(`Loaded command: ${command.data.name}`);
        } else {
          console.warn(`Skipping invalid command file: ${file}`);
        }
      }
    } else if (folder === 'index.ts') {
      console.warn(`Skipping invalid command file: ${folder}`);
    }
  }
};
