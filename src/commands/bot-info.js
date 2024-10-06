const { CommandType } = require("wokcommands");
const BumpEmbed = require("../utils/BumpEmbed");
const ms = require("ms");

let guildCount = 0;
let userCount = 0;

module.exports = {
   // Required for slash commands
   description: "View the bot's information",

   // Create a slash command
   type: CommandType.SLASH,

   guildOnly: true,

   init: (client, instance) => {
      // Fetch the number of guilds the bot is in
      const guilds = client.guilds.cache;

      // Set the number of guilds
      guildCount = guilds.size;

      // Count the number of members
      for (const [id, guild] of guilds) {
         userCount += guild.memberCount;
      }

      // Update the stats every hour
      setInterval(() => {
         // Fetch the number of guilds the bot is in
         const guilds = client.guilds.cache;

         // Set the number of guilds
         guildCount = guilds.size;
         userCount = 0;

         // Count the number of members
         for (const [id, guild] of guilds) {
            userCount += guild.memberCount;
         }
      }, 5 * 60 * 1000);
   },

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      const botinfoembed = new BumpEmbed(client)
         .setAuthor({
            name: `${client.user.username}'s Information`,
            iconURL: client.user.displayAvatarURL(),
         })
         .setFields(
            {
               name: "💎 Total Servers",
               value: `> \`${guildCount.toLocaleString("en")}\``,
               inline: true,
            },
            {
               name: "🌍 Total Members",
               value: `> \`${userCount.toLocaleString("en")}\``,
               inline: true,
            },
            {
               name: "🚀 Total Bumps",
               value: `> \`${(await client.bumpInfos.getBumpCount()).toLocaleString("en")}\``,
               inline: true,
            },
            {
               name: "⏳ Total Uptime",
               value: `> \`${ms(client.uptime || 0)}\``,
               inline: true,
            },
            {
               name: "👑 Owners",
               value: `> \`GhostFace20\`, \`OMJO\``,
               inline: true,
            }
         );

      interaction.reply({
         embeds: [botinfoembed],
      });
   },
};
