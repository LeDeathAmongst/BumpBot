const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require("ms");
const { CooldownTypes } = require("wokcommands");
const BumpEmbed = require("../../../utils/BumpEmbed");

module.exports = async (command, usage) => {
   if (command.commandName !== "bump") {
      return true;
   }

   // Get all the properties
   const { interaction, user, client, guild } = usage;

   // Get all the cooldowns & create the cooldown usuage for the command handler
   const cooldowns = command.instance.cooldowns;
   const cooldownUsage = {
      cooldownType: CooldownTypes.perGuild,
      userId: user.id,
      actionId: `command_${command.commandName}`,
      guildId: guild.id,
      errorMessage: "{TIME}",
   };

   // Check if the user can run this command
   const cooldown = cooldowns?.canRunAction(cooldownUsage);

   if (typeof cooldown === "string") {
      // The cooldown has not ended yet and the command is still on cooldown

      // Get the bump info
      const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

      // Get the username of the user who last bumped the guild
      const lastBumpedBy = bumpInfo.lastBumpedBy.userId
         ? (await guild.members.fetch(bumpInfo.lastBumpedBy.userId))?.user.username ||
           "Can't find user"
         : "No one yet";

      // Calculate the next time the user can use the bump command
      let bumpAgainTimestamp = 0;
      for (const time of cooldown.split(" ")) {
         bumpAgainTimestamp += ms(time);
      }

      // Get the timestamp
      bumpAgainTimestamp = Math.floor(
         new Date().getTime() / 1000 + new Date(bumpAgainTimestamp).getTime() / 1000
      );

      // Create the embed with the information
      const cooldownembed = new BumpEmbed(client)
         .setThumbnail(guild.iconURL() || null)
         .setTitle("❌ Bump Failed")
         .setDescription(`> *The bump cooldown has not expired yet!*`)
         .setFields({
            name: "👉 Details",
            value: `> - **Bump Again:** <t:${bumpAgainTimestamp}:R>\n> - **Bumped Last By:** \`${lastBumpedBy}\``,
         });

      // The buttons
      const buttons = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
            .setEmoji("🔔")
            .setLabel("Remind Me!")
            .setCustomId("reminder_true")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false)
      );

      // Reply to the interaction
      interaction.reply({
         embeds: [cooldownembed],
         components: [buttons],
      });

      return false;
   }

   return true;
};
