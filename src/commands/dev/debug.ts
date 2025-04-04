import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { InteractionReturn } from '@/types/interactionReturn';
import { handleDebugDatabaseGet, handleDebugDatabaseDelete, handleDebugDatabaseSet } from './_debug-database';

export default {
  data: new SlashCommandBuilder()
    .setName('debug')
    .setDescription('debug functions for devs. (Dev Only).')
    .addSubcommandGroup(group =>
      group.setName('database')
      .setDescription('Debug and test/get/set database entries')
      .addSubcommand(cmd =>
        cmd.setName('get')
        .setDescription('Get a value from the database')
        .addStringOption(opt =>
          opt.setName('model')
          .setDescription('The model to get the info from.')
          .setChoices(
            { name: 'bots', value: 'bot' },
            { name: 'User', value: 'user' },
            { name: 'Thread', value: 'thread' },
            { name: 'Starboard', value: 'starboard' },
            { name: 'StickyMessage', value: 'sticky-message' }
          )
          .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('id')
          .setDescription('The unique identifier to search for (user_id, botId, etc).')
          .setRequired(true)
        )

      )
      .addSubcommand(cmd =>
        cmd.setName('delete')
        .setDescription('Delete a entry from the database.')
        .addStringOption(opt =>
          opt.setName('model')
          .setDescription('The model to delete from.')
          .setChoices(
            { name: 'Bots', value: 'bot' },
            { name: 'User', value: 'user' },
            { name: 'Thread', value: 'thread' },
            { name: 'Starboard', value: 'starboard' },
            { name: 'StickyMessage', value: 'sticky-message' }
          )
          .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('id')
          .setDescription('The ID of the entry to delete.')
          .setRequired(true)
        )
      )
      .addSubcommand(cmd =>
        cmd.setName('set')
        .setDescription('Set a value in the database')
        .addStringOption(opt =>
          opt.setName('model')
          .setDescription('The model to update.')
          .setChoices(
            { name: 'Bots', value: 'bot' },
            { name: 'User', value: 'user' },
            { name: 'Thread', value: 'thread' },
            { name: 'Starboard', value: 'starboard' },
            { name: 'StickyMessage', value: 'sticky-message' }
          )
          .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('id')
          .setDescription('The ID of the entry to set.')
          .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('field')
          .setDescription('The field to update.')
          .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('value')
          .setDescription('The value to set for the field.')
          .setRequired(true)
        )
      )
    ),
  async execute(
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
  ):Promise<InteractionReturn> {
    await interaction.deferReply({flags: 'Ephemeral'});
    let result: InteractionReturn = { success: false };

  /**
   * @description Check if user is guildMember
   */
    const ROLE_ID = '1354193758010212423';
    const guildMember = await interaction.guild?.members.fetch(interaction.user.id);
    if (!guildMember) {
      await interaction.editReply({ content: '❌ Could not fetch your member data.' });
      return {success:false};
    }

    if (!guildMember.roles.cache.has(ROLE_ID)) {
      await interaction.editReply({
        content: `🚫 You need the <@&${ROLE_ID}> role to use this command.`,
      });
      return {success:false};
    }

  /**
   * @description Check the params
   */
    try {
      if (interaction.options.getSubcommandGroup() === 'database') {
        switch (interaction.options.getSubcommand()) {
          case 'delete' :
            result = await handleDebugDatabaseDelete(client, interaction);
            break;
          case 'get' :
            result = await handleDebugDatabaseGet(client, interaction);
            break;
          case 'set' :
            result = await handleDebugDatabaseSet(client, interaction);
            break;
          default:
            result = { success:false };
            break;

        }
      }

      if (result.success) {
        return {success: true, message: result.message};
      }

      return {success:false};
    } catch (err) {
      logger.error(
        '❌ | Error while trying to respond to '+
        `"${interaction.commandName}.${interaction.options.getSubcommand()}" `+
        'interaction. ' +
        err,
      );
      const message = await interaction.editReply(`${client.findEmoji('BOT-fail')} There was an Internal error while trying to resolve your request, please inform staff.`);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return {success:false, message};
    }
  },
};
