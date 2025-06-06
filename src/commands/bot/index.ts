import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import handleAddBot from './_add';
import handleInfoBot from './_info';
import handleEditBot from './_edit';
import { InteractionReturn } from '@/types/interactionReturn';

export default {
  data: new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Mange your bot in the server.')
    .addSubcommand(subcommand => subcommand
      .setName('add')
      .setDescription('Request to add your bot to the server.')
      .addStringOption(option => option
        .setName('bot-id')
        .setDescription('The ID of your bot')
        .setRequired(true),
      )
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('The prefix of your bot ( / is also a prefix )')
        .setRequired(true),
      )
      .addStringOption(option => option
        .setName('description')
        .setDescription('A short description about what your bot does.')
        .setRequired(false),
      )
      .addStringOption(option => option
        .setName('library')
        .setDescription('The library your bot is made in')
        .setChoices(
          { name: 'BDFD', value: 'bdfd' },
          { name: 'Discord.py', value: 'discordpy' },
          { name: 'ForgeScript', value: 'forgescript' },
          { name: 'AOI.js', value: 'aoijs' },
          { name: 'Discord.php', value: 'discordphp' },
          { name: 'DSharpPlus', value: 'dsharpplus' },
          { name: 'D++', value: 'discordplusplus' },
          { name: 'DiscordGo', value: 'discordgo' },
          { name: 'JavaCord', value: 'javacord' },
          { name: 'Discordia', value: 'discordia' },
          { name: 'Discord.js', value: 'discordjs' },
          { name: 'NextCord', value: 'nextcord' },
          { name: 'DiscordRB', value: 'discordrb' },
          { name: 'Serenity', value: 'serenity' },
          { name : 'Other', value: 'other' },
        ),
      ),
    )
    .addSubcommand(subcommand => subcommand
      .setName('info')
      .setDescription('Check the info on a bot.')
      .addUserOption(option => option
        .setName('bot')
        .setDescription('What bot do you want to see the info on?')
        .setRequired(false),
      )
      .addStringOption(option => option
        .setName('bot-id')
        .setDescription('bot ID if you prefer to use botID?')
        .setRequired(false),
      ),
    )
    .addSubcommand(subcommand => subcommand
      .setName('edit')
      .setDescription('Edit your own bot info.')
      .addUserOption(option => option
        .setName('bot')
        .setDescription('What bot do you want to see the info on?')
        .setRequired(true),
      )
      .addIntegerOption(option => option
        .setName('invite')
        .setDescription('Change the invite code for your bot. (Admin is not allowed)')
        .setRequired(false),
      )
      .addStringOption(option => option
        .setName('description')
        .setDescription('Change the description of your bot.')
        .setRequired(false),
      )
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('Change the prefix of your discord bot.')
        .setRequired(false),
      )
      .addStringOption(option => option
        .setName('library')
        .setDescription('Change the library your bot uses.')
        .setChoices(
          { name: 'BDFD', value: 'bdfd' },
          { name: 'Discord.py', value: 'discordpy' },
          { name: 'ForgeScript', value: 'forgescript' },
          { name: 'AOI.js', value: 'aoijs' },
          { name: 'Discord.php', value: 'discordphp' },
          { name: 'DSharpPlus', value: 'dsharpplus' },
          { name: 'D++', value: 'discordplusplus' },
          { name: 'DiscordGo', value: 'discordgo' },
          { name: 'JavaCord', value: 'javacord' },
          { name: 'Discordia', value: 'discordia' },
          { name: 'Discord.js', value: 'discordjs' },
          { name: 'NextCord', value: 'nextcord' },
          { name: 'DiscordRB', value: 'discordrb' },
          { name: 'Serenity', value: 'serenity' },
          { name : 'Other', value: 'other' },
        )
        .setRequired(false),
      ),
    ),
  async execute(
    client: ExtendedClient,
    interaction: ChatInputCommandInteraction,
  ):Promise<InteractionReturn> {
    await interaction.deferReply({flags: 'Ephemeral'});
    let result: InteractionReturn = { success: false };

    try {

      if (interaction.options.getSubcommand() === 'add') {
        result = await handleAddBot(client, interaction);
      } else if (interaction.options.getSubcommand() === 'info') {
        result = await handleInfoBot(client, interaction);
      } else if (interaction.options.getSubcommand() === 'edit') {
        result = await handleEditBot(client, interaction);
      } else {
        result = {success: false};
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
      return {success:false, message}
      ;
    }
  },
};
