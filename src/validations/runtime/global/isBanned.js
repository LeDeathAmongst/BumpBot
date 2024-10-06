const BumpEmbed = require("../../../utils/BumpEmbed");

module.exports = async (command, usage) => {
   const { client, interaction, guild, user } = usage;

   //    console.log(command._instance._client.moderation);

   // Check is the user is banned
   if (client.moderation.isBanned(user?.id || "")) {
      interaction.reply({
         embeds: [
            new BumpEmbed()
               .setColor("Red")
               .setDescription(
                  `❌ You have banned from using SkyBumps. To dispute the ban, please visit our [support server](${support_invite})`
               ),
         ],
      });

      return false;
   }

   // Check is the guild is banned
   if (client.moderation.isBanned(guild?.id || "")) {
      interaction.reply({
         embeds: [
            new BumpEmbed()
               .setColor("Red")
               .setDescription(
                  `❌ This server has been banned from using SkyBumps. To dispute the ban, please visit our [support server](${support_invite})`
               ),
         ],
      });

      return false;
   }

   // The guild and user are not banned
   return true;
};
