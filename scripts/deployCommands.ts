import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { logger } from '../src/utils';

config();

const token = process.env.DISCORD_BOT_TOKEN!;
const clientId = process.env.DISCORD_CLIENT_ID!;
const guildId = process.env.DISCORD_GUILD_ID!;

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  new SlashCommandBuilder().setName('eval').setDescription('Evaluates JavaScript code (dev only)')
    .addStringOption(option => option.setName('code').setDescription('Code to evaluate').setRequired(true)),
  new SlashCommandBuilder().setName('bot').setDescription('Mange your bot in the server.')
    .addSubcommand(subcommand => subcommand
      .setName('add')
      .setDescription('Request to add your bot to the server.')
      .addIntegerOption(option => option
        .setName('bot-id')
        .setDescription('The ID of your bot')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('The prefix of your bot ( / is also a prefix )')
        .setRequired(true)
      )
      .addStringOption(option => option
        .setName('description')
        .setDescription('A short description about what your bot does.')
        .setRequired(false)
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
          { name: "DSharpPlus", value: "dsharpplus" },
          { name: "D++", value: "discordplusplus" },
          { name: "DiscordGo", value: "discordgo" },
          { name: "JavaCord", value: "javacord" },
          { name: "Discordia", value: "discordia" },
          { name: "Discord.js", value: "discordjs" },
          { name: "NextCord", value: "nextcord" },
          { name: "DiscordRB", value: "discordrb" },
          { name: "Serenity", value: "serenity" },
          { name : "Other", value: "other" }
        )
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('info')
      .setDescription('Check the info on a bot.')
      .addIntegerOption(option => option
        .setName('bot')
        .setDescription('What bot do you want to see the info on?')
        .setRequired(true)
      )
    )
    .addSubcommand(subcommand => subcommand
      .setName('edit')
      .setDescription('Edit your own bot info.')
      .addUserOption(option => option
        .setName('bot')
        .setDescription('What bot do you want to see the info on?')
        .setRequired(true)
      )
      .addIntegerOption(option => option
        .setName('invite')
        .setDescription('Change the invite code for your bot. (Admin is not allowed)')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('prefix')
        .setDescription('Change the prefix of your discord bot.')
        .setRequired(false)
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
          { name: "DSharpPlus", value: "dsharpplus" },
          { name: "D++", value: "discordplusplus" },
          { name: "DiscordGo", value: "discordgo" },
          { name: "JavaCord", value: "javacord" },
          { name: "Discordia", value: "discordia" },
          { name: "Discord.js", value: "discordjs" },
          { name: "NextCord", value: "nextcord" },
          { name: "DiscordRB", value: "discordrb" },
          { name: "Serenity", value: "serenity" },
          { name : "Other", value: "other" }
        )
        .setRequired(false)
      )
    ),
  new SlashCommandBuilder().setName('staff').setDescription('Commands only for staff members')
    .addSubcommand(subCommand => subCommand
      .setName('embed')
      .setDescription('Generate a message or embed (staff)')
      .addStringOption(option => option
        .setName('message')
        .setDescription('What should the normal message be.')
        .setRequired(false)
      )
      .addRoleOption(option => option
        .setName('mention')
        .setDescription('Which role to mention.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('color')
        .setDescription('The color of the embed. (default is white)')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('title')
        .setDescription('The title of the embed.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('author')
        .setDescription('The embed author (above the title)')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('description')
        .setDescription('the description of the embed.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('footer')
        .setDescription('The footer of the embed.')
        .setRequired(false)
      )
      .addBooleanOption(option => option
        .setName('inline')
        .setDescription('If the fields should show inline')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-one-name')
        .setDescription('The name of field one.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-one-content')
        .setDescription('The description of field one.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-two-name')
        .setDescription('The name of field two.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-two-description')
        .setDescription('The description of field two.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-three-name')
        .setDescription('The name of field three.')
        .setRequired(false)
      )
      .addStringOption(option => option
        .setName('field-three-description')
        .setDescription('The description of field three.')
        .setRequired(false)
      )
    ),
  new SlashCommandBuilder().setName('bot-channel').setDescription('Manage your bots thread.')
    .addSubcommand(subCommand => subCommand
      .setName('create')
      .setDescription('Create a custom thread for your bot.')
      .addUserOption(option => option
        .setName('bot')
        .setDescription('The bot your making this thread for.')
        .setRequired(true)
      )
    )
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

async function deployCommands() {
  try {
    logger.info('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commands,
      }
    );

    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error('Error while deploying commands:', error);
  }
}

deployCommands();