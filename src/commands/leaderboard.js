const { CommandType } = require("wokcommands");
const BumpEmbed = require("../utils/BumpEmbed");

module.exports = {
   // Required for slash commands
   description: "View the top servers on Bumps",

   // Create a slash command
   type: CommandType.SLASH,

   guildOnly: true,

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      const servers = await client.bumpInfos.getLeaderboard();

      const fields = [];
      for (let i = 0; i < servers.length; i++) {
         const guild = await client.guilds.cache.get(servers[i]._id);
         if (!guild) continue;

         let emoji;
         switch (i) {
            case 0:
               emoji = "🥇";
               break;
            case 1:
               emoji = "🥈";
               break;
            case 2:
               emoji = "🥉";
               break;
            default:
               emoji = "🔹";
               break;
         }

         fields.push({
            name: `${emoji} (#${i + 1}) ${guild.name}`,
            value: `> \`${servers[i].bumpCount?.toLocaleString("en") || 0} Bumps\`\n** **`,
         });
      }

      const leaderboardembed = new SkyBumpEmbed(client)
         .setAuthor({
            name: `${client.user.username}'s Leaderboard`,
            iconURL: client.user.displayAvatarURL(),
         })
         .setFields(fields);

      interaction.reply({
         embeds: [leaderboardembed],
      });
   },
};
