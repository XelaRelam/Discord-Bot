import { Client } from 'discord.js';
import fs from 'fs';
import path from 'path';

export const loadEvents = async (client: Client) => {
  const eventsPath = path.join(__dirname, '../../events');
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.ts'));

  for (const file of eventFiles) {
    const eventPath = path.join(eventsPath, file);
    const event = (await import(eventPath)).default;
    if (event && event.name && event.execute) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`Loaded event: ${event.name}`);
    } else {
      console.warn(`Skipping invalid event file: ${file}`);
    }
  }
};