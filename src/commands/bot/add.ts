import { PrismaClient } from '@prisma/client';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ColorResolvable, SlashCommandBuilder, TextChannel } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';
import { EmbedBuilder } from '@discordjs/builders';
import { botHasEmbedPerms, botHasSendPerms, botHasViewPerms } from '../../middleware/permissions';
import * as database from './../../database';
import { userExists } from '../../middleware/userExists';

const prisma = new PrismaClient();

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

  async execute(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
    if (interaction.options.getSubcommand() === 'add') {
      await interaction.deferReply({flags: "Ephemeral"});

      if (false) {
        return interaction.editReply({ content: 'This command is disabled at this moment.' });
      }

      if (!(await userExists(client, interaction.options.getString('bot-id') || '0'))) {
        return interaction.editReply({ content: `I couldn't find a bot account.`});
      }

      let guild = client.guilds.fetch('1235165357879328870');
      let botID = interaction.options.getString('bot-id') || client.user.id;
      let botInfo = client.users.fetch(botID);
      const description = interaction.options.getString(`description`);

      let bot = client.users.fetch(botID);
      if (!(await bot).bot) {
        return interaction.editReply({ content: `Could not find this bot.`});
      }

      let dbBot = await prisma.bot.findUnique({
        where: { botId: botID },
      });
      let dbUser = await prisma.user.findUnique({
        where: { user_id: interaction.user.id },
      });

      if (dbBot?.botBanned) {
        return interaction.editReply({content: `This bot has been banned by a staff member.`});
      }

      if (dbBot?.botAwaiting) {
        return interaction.editReply({content: `This bot is already waiting approval, please wait until it is approved or declined.`});
      }

      if (dbUser?.userBanned) {
        return interaction.editReply({content: `You have been banned by a staff member.`});
      }

      if (dbUser?.hasAwaitedBot) {
        return interaction.editReply({content: `You already have a bot waiting for approval, try again once that bot is accepted or declined.`});
      }

      /**
       * @description Check if bot can send messages
       */
      const staffChannel = client.channels.cache.get('1278051624916353046') as TextChannel;
      if (!botHasSendPerms(client, staffChannel) || !botHasEmbedPerms(client, staffChannel) || !botHasViewPerms(client, staffChannel)) {
        return interaction.editReply({content: `Something is wrong with the staff channel, please inform a staff member.`});
      }
      const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
      if (!botHasSendPerms(client, publicChannel) || !botHasEmbedPerms(client, publicChannel) || !botHasViewPerms(client, publicChannel)) {
        return interaction.editReply({content: `Something is wrong with the announcement channel, please inform a staff member.`});
      }

      /**
       * @description Embed building and sending
       */

      // Fields for embed
      let botInfoFieldValue =
        `<@${botID}> ~ ${botID}\n` +
        `**Invite:** [Click](https://discord.com/api/oauth2/authorize?client_id=${botID}&permissions=0&scope=bot)\n` +
        `**Prefix**: \`${interaction.options.getString('prefix')}\``;

      if (interaction.options.getString('library')) {
        botInfoFieldValue += `\n**Library**: \`${interaction.options.getString('library')}\``;
      }

      const embed = new EmbedBuilder()
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16))
        .setTitle('Awaiting approval')
        .setDescription(`<:Check:1267447929015373914> **@${interaction.user.globalName}**, Your bot <@${botID}> is waiting approval from the staff team.`);


      const publicEmbed = new EmbedBuilder()
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16))
        .setTitle(`New bot request!`)
        .setDescription(`<@${interaction.user.id}>'s bot @${(await botInfo).username} is awaiting approval.`);

      const staffEmbed = new EmbedBuilder()
        .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16))
        .setTitle(`New bot request!`)
        .setThumbnail((await botInfo).avatarURL())
        .addFields(
          { name: `Bot Info:`, value: botInfoFieldValue },
          { name: `Developer:`, value: `<@${interaction.user.id}>`}
        );

      if (description) {
        staffEmbed.setDescription(description);
      }

      /**
       * @description Button Row
       */
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`approve-${botID}-${interaction.user.id}`)
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`deny-${botID}-${interaction.user.id}`)
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)
        );

      interaction.editReply({ embeds: [embed] });
      publicChannel.send({ embeds: [publicEmbed] });
      staffChannel.send({ embeds: [staffEmbed], components: [row] });

      /**
       * @description Update database
       */
      const botStats = {
        invite: 0,
        library: interaction.options.getString('library') || `Unknown`,
        description: interaction.options.getString('description') || "N/A",
        prefix: interaction.options.getString(`prefix`) || `/`,
        awaited: true
      };

      database.upsertBotData(interaction.user.id, botID, botStats);

      const userData = {
        hasAwaitedBot: true,
      };
      database.upsertUserData(interaction.user.id, userData);

      // TO GET THE BOTS OF A USER
      // prisma.bot.findMany({ where: { userId: "123" } })
    };
  }
};
