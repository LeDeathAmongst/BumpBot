const { CommandType, CooldownTypes } = require("wokcommands");
const ms = require("ms");
const BumpEmbed = require("../utils/BumpEmbed");
const config = require("../config.json");

let guildCount = 0;
let userCount = 0;

module.exports = {
   // Required for slash commands
   description: "Bump your server across other servers!",

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
   callback: async ({ client, interaction, guild, channel, member, instance }) => {
      // Get the guild's bump info
      const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

      // Bump the guild
      await client.bumps.addBump(guild.id, channel.id, member.user.id);

      // Start the cooldown
      await instance.cooldowns?.start({
         cooldownType: CooldownTypes.perGuild,
         userId: member.user.id,
         actionId: `command_bump`,
         guildId: guild.id,
         duration: config.cooldown,
         errorMessage: "You cannot use the bump command for another {TIME}.",
      });

      // Create the bump reply embed
      const bumpembed = new BumpEmbed(client)
         .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
         .setTitle("⚡ Bump Successful")
         .setThumbnail(guild.iconURL())
         .setDescription("> *Your bump was successful and has been sent out to other servers.*")
         .setFields(
            {
               name: "🌍 Shared to",
               value: `> \`${guildCount.toLocaleString("en")}+\` servers`,
               inline: true,
            },
            {
               name: "🔥 Reached",
               value: `> \`${userCount.toLocaleString("en")}+\` users`,
               inline: true,
            },
            {
               name: "⏳ Cooldown",
               value: `> \`${ms(config.cooldown * 1000)
                  .replace("h", " hour")
                  .replace("m", " minutes")}\``,
               inline: true,
            },
            {
               name: "🚀 Bumped",
               value: `> \`${(bumpInfo.bumpCount + 1).toLocaleString("en")}\` times`,
               inline: true,
            }
         );

      interaction.reply({
         embeds: [bumpembed],
      });
   },
};
