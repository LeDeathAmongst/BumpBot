const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const BumpEmbed = require("../utils/BumpEmbed");
const { CooldownTypes } = require("wokcommands");

module.exports = (instance, client) => {
   // Check every 5 seconds if any cooldowns are expired
   setInterval(async () => {
      for (const [key, expires] of instance.cooldowns._cooldowns) {
         // Get the guild ID from the cooldown key
         const guildId = key.split("-").shift();

         // Check if the guild can run the bump command again
         const canRun =
            typeof instance.cooldowns.canRunAction({
               cooldownType: CooldownTypes.perGuild,
               actionId: `command_bump`,
               guildId,
               errorMessage: "{TIME}",
            }) === "string"
               ? false
               : true;

         if (canRun) {
            // The user can run the command again

            // Get the guild's bump info
            const bumpInfo = await client.bumpInfos.getBumpInfo(guildId);

            // Get the last bumped user ID
            const userId = bumpInfo.lastBumpedBy.userId;
            if (!userId) {
               continue;
            }

            // Get the user's profile and check if they have their reminder on
            const profile = await client.profiles.getProfile(userId);
            if (!profile.remind) {
               continue;
            }

            // Get the guild
            const guild = client.guilds.cache.get(guildId);
            if (!guild) {
               continue;
            }

            // Get the guild's bump channel
            const channel = guild.channels.cache.get(bumpInfo.lastBumpedBy.channelId);
            if (!channel) {
               continue;
            }

            // Create a timestamp from when it was last bumped
            const timestamp = Math.floor(new Date(expires).getTime() / 1000);

            // Send the bump reminder
            channel.send({
               content: `<@${userId}>`,
               embeds: [
                  new BumpEmbed(client)
                     .setTitle("🚀 It's Bump Time!")
                     .setDescription(
                        `> *It's that time again! You can bump your server again using the bump button below.*`
                     ),
               ],
               components: [
                  new ActionRowBuilder().addComponents(
                     // Bump
                     new ButtonBuilder()
                        .setEmoji("🚀")
                        .setLabel("Bump!")
                        .setCustomId("reminder-bump")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false),

                     // Manage notifications
                     new ButtonBuilder()
                        .setEmoji("🔔")
                        .setLabel("Disable Notifications")
                        .setCustomId("reminder_false")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(false)
                  ),
               ],
            });

            instance.cooldowns.cancelCooldown({
               cooldownType: CooldownTypes.perGuild,
               actionId: `command_bump`,
               guildId,
            });
         }
      }
   }, 1000 * 5);
};
