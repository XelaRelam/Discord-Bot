import { ExtendedClient } from '@/types/extendedClient';
import { botHasEmbedPerms, botHasSendPerms, botHasViewPerms } from '@/middleware/permissions';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { userExists } from '@/middleware/userExists';
import * as database from '@/database';
import { InteractionReturn } from '@/types/interactionReturn';


export default async function handleAddBot(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
): Promise<InteractionReturn> {
  if (!(await userExists(client, interaction.options.getString('bot-id') || '0'))) {
    const message = await interaction.editReply({ content: 'I couldn\'t find a bot account.'});
    return { success: false, message };
  }

  const botID = interaction.options.getString('bot-id') || client.user.id;
  const botInfo = client.users.fetch(botID);
  const description = interaction.options.getString('description');

  const bot = client.users.fetch(botID);

  if (!(await bot).bot) {
    const message = await interaction.editReply({ content: "I couldn't find a bot account." });
    return { success: false, message };
  }

  const dbBot = await database.prisma.bot.findUnique({
    where: { botId: botID },
  });

  const dbUser = await database.prisma.user.findUnique({
    where: { user_id: interaction.user.id },
  });

  if (dbBot?.botBanned) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot has been banned by a staff member.`});
    return { success: false, message };
  }

  if (dbBot?.botAwaiting) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot is already waiting approval, please wait until it is approved or declined.`});
    return { success: false, message };
  }

  if (dbUser?.userBanned) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} You have been banned by a staff member.`});
    return { success: false, message };
  }

  if (dbUser?.hasAwaitedBot) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} You already have a bot waiting for approval, try again once that bot is accepted or declined.`});
    return { success: false, message };
  }

  /**
   * @description Check if bot can send messages
   */
  const staffChannel = client.channels.cache.get('1278051624916353046') as TextChannel;
  if (
    !botHasSendPerms(client, staffChannel)
    || !botHasEmbedPerms(client, staffChannel)
    || !botHasViewPerms(client, staffChannel)
  ) {
    const message = await interaction.editReply(
      {content:
        `${client.findEmoji('BOT-fail')} `+
        'Something is wrong with the staff channel, please inform a staff member.',
      },
    );
    return { success: false, message };
  }
  const publicChannel = client.channels.cache.get('1235263212497141911') as TextChannel;
  if (
    !botHasSendPerms(client, publicChannel)
    || !botHasEmbedPerms(client, publicChannel)
    || !botHasViewPerms(client, publicChannel)
  ) {
    const message = await interaction.editReply(
      { content:
        `${client.findEmoji('BOT-fail')} ` +
        'Something is wrong with the announcement channel, '+
        'please inform a staff member.',
      },
    );
    return { success: false, message };
  }

  /**
   * @description Embed building and sending
   */

  // Fields for embed
  let botInfoFieldValue =
    `<@${botID}> ~ ${botID}\n` +
    '**Invite:** [Click](https://discord.com/api/oauth2/authorize?'+
    `client_id=${botID}&permissions=0&scope=bot)\n` +
    `**Prefix**: \`${interaction.options.getString('prefix')}\``;

  if (interaction.options.getString('library')) {
    botInfoFieldValue += `\n**Library**: \`${interaction.options.getString('library')}\``;
  }

  const embed = new EmbedBuilder()
    .setTitle('Awaiting approval')
    .setDescription(
      `<:Check:1355193759905874010> **@${interaction.user.globalName}**, `+
      `Your bot <@${botID}> is waiting approval from the staff team.`,
    )
    .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));


  const publicEmbed = new EmbedBuilder()
    .setTitle('New bot request!')
    .setDescription(
      `<@${interaction.user.id}>'s bot ` +
      `@${(await botInfo).username} is awaiting approval.`,
    )
    .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

  const staffEmbed = new EmbedBuilder()
    .setTitle('New bot request!')
    .setThumbnail((await botInfo).avatarURL())
    .addFields(
      { name: 'Bot Info:', value: botInfoFieldValue },
      { name: 'Developer:', value: `<@${interaction.user.id}>`},
    )
    .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

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
        .setCustomId(`decline-${botID}-${interaction.user.id}`)
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger),
    );

  const message = await interaction.editReply({ embeds: [embed] });
  publicChannel.send({ embeds: [publicEmbed] });
  staffChannel.send({ embeds: [staffEmbed], components: [row] });

  /**
   * @description Update database
   */
  const botStats = {
    invite: 0,
    library: interaction.options.getString('library') || 'Unknown',
    description: interaction.options.getString('description') || 'N/A',
    prefix: interaction.options.getString('prefix') || '/',
    awaited: true,
  };

  database.upsertBotData(interaction.user.id, botID, botStats);

  const userData = {
    hasAwaitedBot: true,
  };
  database.upsertUserData(interaction.user.id, userData);
  return { success: true, message };

  // TO GET THE BOTS OF A USER
  // prisma.bot.findMany({ where: { userId: "123" } })
};
