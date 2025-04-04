import { ExtendedClient } from '../../types/extendedClient';
import { ChatInputCommandInteraction, User } from 'discord.js';
import * as database from '../../database';
import { EmbedBuilder } from '@discordjs/builders';
import { InteractionReturn } from '@/types/interactionReturn';

export default async function handleEditBot(
  client: ExtendedClient,
  interaction: ChatInputCommandInteraction,
):Promise<InteractionReturn> {
  let bot: User | null = null;
  const botOption = interaction.options.getUser('bot');

  bot = botOption;

  if (!bot?.bot) {
    const message = await interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} The profile you provided is a user and not a bot, please provide a bot.`,
    });
    return {success:false, message};
  }

  const botData = await database.getBot(bot.id);
  if (!botData.success || !botData.data?.botAdded) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot was not found in our system.`});
    return {success:false, message};
  }

  if (!(botData.data?.userId === interaction.user.id)) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} This is not your bot, you can only edit your own bot.`});
    return {success:false, message};
  }

  const botInvite = interaction.options.getInteger('invite') || botData.data?.invite;
  const botPrefix = interaction.options.getString('prefix') || botData.data?.prefix;
  const botLibrary = interaction.options.getString('library') || botData.data?.library;
  const botDescription = interaction.options.getString('description') || botData.data?.description;

  let botInfoFieldValue = '';

  if (
    (botInvite === botData.data?.invite) &&
    (botPrefix === botData.data?.prefix) &&
    (botLibrary === botData.data?.library) &&
    (botDescription === botData.data?.description)
  ) {
    const message = await interaction.editReply({content: `${client.findEmoji('BOT-fail')} Values are the same as before, no changes where made.`});
    return {success:false, message};
  }

  if (!(botInvite === botData.data?.invite)) {
    botInfoFieldValue += `\nChanged Invite code from \`${botData.data?.invite}\` to \`${interaction.options.getInteger('invite')}\``;
  }

  if (!(botPrefix === botData.data?.prefix)) {
    botInfoFieldValue += `\nChanged prefix from \`${botData.data?.prefix}\` to \`${interaction.options.getString('prefix')}\``;
  }

  if (!(botLibrary === botData.data?.library)) {
    botInfoFieldValue += `\nChanged library from \`${botData.data?.library}\` to \`${interaction.options.getString('library')}\``;
  }

  if (!(botDescription === botData.data?.description)) {
    botInfoFieldValue += `\nChanged description from \`\`\`${botData.data?.description}\`\`\` to \`\`\`${interaction.options.getString('description')}\`\`\``;
  }

  const embed = new EmbedBuilder()
    .setTitle(`BotInfo: @${bot.username}`)
    .setThumbnail(bot.avatarURL({extension: 'webp', size: 512}))
    .addFields(
      {
        name: 'Bot Info:',
        value: botInfoFieldValue,
      },
    )
    .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));

  const botStats = {
    invite: botInvite,
    library: botLibrary,
    description: botDescription,
    prefix: botPrefix,
    awaited: false,
  };

  database.upsertBotData(interaction.user.id, bot.id, botStats);

  console.log(bot);

  const message = await interaction.editReply({embeds: [embed]});
  return {success:true, message};

}