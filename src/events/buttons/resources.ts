import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/extendedClient';
import { logger } from '../../utils';

export default {
  customId: (id: string): boolean => id.startsWith('resources-'),
  async execute(
    client: ExtendedClient,
    interaction: ButtonInteraction,
  ):Promise<void> {
    const type = interaction.customId.split('-')[1];
    await interaction.deferReply({flags: 'Ephemeral'});

    try{
      switch (type) {
        case ('packages'): {
          const embed = new EmbedBuilder()
            .setTitle('Slash Command Package')
            .setDescription(
              '📦 - Slash Command Package\n' +
              'The legacy package for older videos, perfect for beginners but not built for scale. This is the go-to if you are new to development here on discord!\n\n' +
              '📦 - Dev Toolkit\n' +
              'All new and improved with some much needed fresh paint, this package is built to last and comes with everything a starting developer could need, how awesome is that?\n\n' +
              '🏅 - Badge Images\nThis is just an archive of images for the older Badge Command, this is not a package for running bots!',
            )
            .setColor('#A020F0')
            .setTimestamp(new Date());

          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setURL('https://www.mediafire.com/file/9zb43qlrstlfrex/SlashCommand_Package.zip/file')
                .setLabel('Slash Commands Package')
                .setEmoji('<:slash_commands:1355164714572841090>')
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setURL('https://www.mediafire.com/file/ikedlc33cjum6ii/DevToolKit.zip/file')
                .setLabel('Dev Toolkit')
                .setEmoji('<:developer:1355166127562559518>')
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setURL('https://www.mediafire.com/file/ijj66t743bcv0l8/Badges.zip/file')
                .setLabel('Badge Images')
                .setEmoji('<:badge:1355165602456539136>')
                .setStyle(ButtonStyle.Link),
            );
          await interaction.editReply({ embeds: [embed], components: [row] });
          return;
        }
        case ('databases'): {
          const embed = new EmbedBuilder()
            .setTitle('Databases')
            .setDescription(
              'Which database are you looking to use?\n' +
              '🍃 - MongoDB : Easy for beginners, very flexible and scalable, can be a bottleneck if not used correctly.\n' +
              '🐬 - SQL : The big grand daddy of databases, very powerful and fast but difficult to learn properly',
            )
            .setColor('#A020F0')
            .setTimestamp(new Date());

          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setURL('https://www.mongodb.com/')
                .setLabel('🍃 MongoDB')
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setURL('https://www.sql.org/')
                .setLabel('🐬 SQL')
                .setStyle(ButtonStyle.Link),
            );
          await interaction.editReply({ embeds: [embed], components: [row] });
          return;
        }
        case ('javascript'): {
          const embed = new EmbedBuilder()
            .setTitle('JavaScript Resources')
            .setDescription(
              '📗 - Beginner\n' +
              '📘 - Intermediate\n' +
              '📕 - Advanced\n' +
              '📚 - Mastery\n\n' +

              'Ready to learn JavaScript? Here are some resources to help you get started!\n' +
              'Please refer to the above emojis to determine the difficulty of the resource, we recommend starting with the 📗 resources if you are new to programming!\n\n' +

              '📗 - [JavaScript.Info](https://javascript.info/)\n' +
              '📗 - [Learn JavaScript](https://learnjavascript.online/)\n' +
              '📗 - [Discord.js Guide](https://discordjs.guide/#before-you-begin)\n' +
              '📘 - [Discord.js Documentation](https://discord.js.org/#/docs/discord.js/main/general/welcome)\n' +
              '📘 - [XelaRelam Coding Website](https://xelarelam.vercel.app/)\n' +
              '📘 - [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)\n' +
              '📕 - [Official Discord API](https://discord.com/developers/docs/intro)\n' +
              '📕 - [Node.js Docs](https://nodejs.org/en/docs/)\n' +
              '📚 - [MDN - Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)\n' +
              '📚 - [MDN - Memory](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management)',
            )
            .setTimestamp(new Date())
            .setColor(parseInt('#A020F0'.replace(/^#/, ''), 16));

          const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
              new ButtonBuilder()
                .setURL('https://javascript.info/')
                .setLabel('JavaScript.Info')
                .setEmoji('<:javascriptInfo:1355168998857117839>')
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setURL('https://learnjavascript.online/')
                .setLabel('Learn JavaScript')
                .setEmoji('<:learnjavascript:1355168772406640901>')
                .setStyle(ButtonStyle.Link),
              new ButtonBuilder()
                .setURL('https://discordjs.guide/')
                .setLabel('Discord.js Guide')
                .setEmoji('<:discordjs:1355168325868585141>')
                .setStyle(ButtonStyle.Link),
            );
          await interaction.editReply({ embeds: [embed], components: [row] });
          return;
        }
        default: {
          await interaction.editReply({ content: 'Coming soon!, please use <#1235241560023502889>, help us to complete' });
          return;
        }
      }
    } catch (err) {
      logger.error(
        '❌ | Error while trying to respond to "resources-*" button interaction.'+
        err,
      );
      interaction.editReply(`${client.findEmoji('BOT-fail')} There was an Internal error while trying to resolve your request, please inform staff.`);
      if (err instanceof Error) {
        console.error('Error stack:', err.stack);
      }
      return;
    }
  },
};