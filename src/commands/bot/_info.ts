import { ExtendedClient } from "@/types/extendedClient";
import { ChatInputCommandInteraction, User } from "discord.js";
import * as database from '../../database';

export default async function handleInfoBot(client: ExtendedClient, interaction: ChatInputCommandInteraction) {
  const bot = interaction.options.getUser('bot-id') as User;

  if (interaction.user.id === '705306248538488947') {
    return interaction.editReply({ content: `${client.findEmoji('BOT-fail')} This command is disabled at this moment.` });
  }

  if ((await database.getBot(bot.id)).success === false) {
    return interaction.editReply({content: `${client.findEmoji('BOT-fail')} This bot was not found in our system.`});
  }
}