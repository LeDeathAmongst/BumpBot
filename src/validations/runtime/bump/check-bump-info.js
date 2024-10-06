const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../../../config.json");

module.exports = async (command, usage) => {
   if (command.commandName !== "bump") {
      return true;
   }

   const { interaction, guild, client } = usage;

   // Get the bump info for the guild
   let bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

   // Check if the guild has set a channel
   if (!bumpInfo.channelId) {
      interaction.reply({
         ephemeral: true,
         embeds: [
            new EmbedBuilder()
               .setTitle("❌ Missing Bump Channel")
               .setColor(config.embedColor)
               .setDescription(
                  "> *Please select a bump channel before bumping this server using the button below.*"
               ),
         ],
         components: [
            new ActionRowBuilder().addComponents(
               new ButtonBuilder()
                  .setEmoji("📝")
                  .setLabel("Set Bump Channel")
                  .setCustomId("set-channel-run")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(false)
            ),
         ],
      });

      return false;
   }

   // Check if the guild has set a description
   if (!bumpInfo.description) {
      interaction.reply({
         ephemeral: true,
         embeds: [
            new EmbedBuilder()
               .setTitle("❌ Missing Server Description")
               .setColor(config.embedColor)
               .setDescription("> *Please enter a server description using the button below.*"),
         ],
         components: [
            new ActionRowBuilder().addComponents(
               new ButtonBuilder()
                  .setEmoji("📝")
                  .setLabel("Set Description")
                  .setCustomId("set-description-run")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(false)
            ),
         ],
      });

      return false;
   }

   return true;
};
