import { Events, Interaction, GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/extendedClient';
import { logger } from '../utils';
import { handleUserJoin } from './userJoin';

export default {
  name: Events.GuildMemberAdd,
  async execute(client: ExtendedClient, member: GuildMember) {
    logger.debug(`❔ | UserJoined ${member.id}`);
    await handleUserJoin(client, member);
  }
};
