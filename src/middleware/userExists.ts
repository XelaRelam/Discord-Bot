import { Client } from 'discord.js';
import { userIdRegex } from '../types/regex';

export const userExists = async (
  client: Client,
  userID: string,
): Promise<boolean> => {
  if (!userIdRegex.test(userID)) return false;

  try {
    await client.users.fetch(userID, { force: true });
    return true;
  } catch {
    return false;
  }
};