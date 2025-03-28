import { ExtendedClient } from "@/types/extendedClient";
import { ChatInputCommandInteraction, User } from "discord.js";
import * as database from '../../database';
import { userExists } from "../../middleware/userExists";
import { EmbedBuilder } from "@discordjs/builders";

export default async function handleInfoBot(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
  let bot: User | null = null;
  const botOption = interaction.options.getUser('bot');
  const botIdOption = interaction.options.getString('bot-id');

  if (botOption) {
    bot = botOption;
  } else if (botIdOption !== null) {
    const botId: string = botIdOption;
    if (await userExists(client, botId)) {
      bot = await client.users.fetch(botId, { force: true });
    }
  }

  if (!bot) {
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} Couldn't find query. Please provide either a user ID or user account option (only use one).`
    });
  }

  if (!bot.bot) {
    return interaction.editReply({
      content: `${client.findEmoji('BOT-fail')} The profile you provided is a user and not a bot, please provide a bot.`
    });
  }

  const botData = await database.getBot(bot.id);
  if (!botData.success || !botData.data?.botAdded) {
    return interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot was not found in our system.`});
  }

  const description = await database.getBotInfo(bot.id, 'description');
  const addedAt = botData.data?.addedAt ? new Date(botData.data.addedAt).getTime() : Date.now();
  let botInfoFieldValue =
    `**Prefix**: \`${botData.data?.prefix}\`\n` +
    `**Developed By**: <@${botData.data?.userId}>\n` +
    `**Library**: \`${botData.data?.library}\`\n` +
    `**Invite:** [No Perms](https://discord.com/api/oauth2/authorize?client_id=${bot.id}&permissions=0&scope=bot) `;

  if (botData.data?.invite) {
    botInfoFieldValue += ` [With Perms](https://discord.com/api/oauth2/authorize?client_id=${bot.id}&permissions=${botData.data?.invite}&scope=bot)`;
  }

  const embed = new EmbedBuilder()
    .setTitle(`BotInfo: @${bot.displayName}`)
    .addFields(
      {
        name: `Bot Info:`,
        value: botInfoFieldValue
      },
      addedAt !== undefined
        ? {
          name: `** **`,
          value: `**Added On**: <t:${Math.round(addedAt / 1000)}:D>\n**Approved By**: <@${botData.data?.approvedBy}>`
        }
        : {
          name: `** **`,
          value: `**Added On**: \`Unknown\`\n**Approved By**: <@${botData.data?.approvedBy}>`
        }
    )
    .setThumbnail(bot.avatarURL({extension: 'webp', size: 512}))
    .setColor(parseInt('#00FFFF'.replace(/^#/, ''), 16));


  if (description.success && typeof description.value === 'string') {
    embed.setDescription(description.value);
  }

  return interaction.editReply({embeds: [embed]});
}