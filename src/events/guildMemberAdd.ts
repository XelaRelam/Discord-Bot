import { Events, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { logger } from '../utils';
import { handleUserJoin } from './userJoin';
import { addUserToDatabase } from './userJoin/_addUserToDatabase';

export default {
  name: Events.GuildMemberAdd,
  async execute(
    client: ExtendedClient,
    member: GuildMember,
  ):Promise<void> {
    logger.debug(`❔ | UserJoined ${member.id}`);

    try {
      await handleUserJoin(client, member);
      await addUserToDatabase(client, member);
      if (!member.user.bot) {
        member.roles.add('1235173902720827463');
      }
    } catch (err) {
      logger.error(`Error when adding user. ${err}`);
      if (err instanceof Error) {
        console.log(`Error Stack: ${err.stack}`);
      }
    }
    return;
  },
};
