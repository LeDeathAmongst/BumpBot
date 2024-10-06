const {
   EmbedBuilder,
   PermissionFlagsBits,
   ButtonStyle,
   ButtonBuilder,
   ActionRowBuilder,
} = require("discord.js");
const config = require("../../../config.json");

const requiredPermissions = [
   PermissionFlagsBits.ViewChannel,
   PermissionFlagsBits.SendMessages,
   PermissionFlagsBits.EmbedLinks,
];

const permissions = Object.entries(PermissionFlagsBits).map((perm) => ({
   name: perm[0],
   value: perm[1],
}));

module.exports = async (command, usage) => {
   if (command.commandName !== "bump") {
      return true;
   }

   const { interaction, client, guild } = usage;

   // Get the bump info of the guild
   const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

   // Check if the bump channel exists
   const channel = bumpInfo.channelId ? await guild.channels.fetch(bumpInfo.channelId) : null;
   if (!channel) {
      // The bump channel was not found
      interaction.reply({
         ephemeral: true,
         embeds: [
            new EmbedBuilder()
               .setColor(config.embedColor)
               .setTitle("❌ Deleted Bump Channel")
               .setDescription(
                  "> *Your bump channel was not found, please set a new bump channel using the button below.*"
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

   // Check if members in the guild can view the channel
   if (!channel.permissionsFor(guild.roles.everyone.id)?.has(PermissionFlagsBits.ViewChannel)) {
      // Everyone cannot view the server's bump channel

      // Get the missing permission's gif
      const gifObject = config.permission_urls.find((obj) => obj.name === "ViewChannel") || {
         name: null,
         url: null,
      };

      // Reply to the interaction
      interaction.reply({
         ephemeral: true,
         //  allowedMentions: { parse: [] },
         embeds: [
            new EmbedBuilder()
               .setColor(config.embedColor)
               .setTitle("❌ Missing Permissions")
               .setDescription(
                  `Woah, the @everyone role is missing very important permissions in your **bump channel**! Please add the following permissions in <#${bumpInfo.channelId}>.`
               )
               .setFields({
                  name: "** **",
                  value: `> \`ViewChannel\``,
               })
               .setImage(gifObject.url),
         ],
      });

      return false;
   }

   // Check if the client has all the required permissions
   let missingPermissions = [];
   for (const requiredPermission of requiredPermissions) {
      // Check if the client has the required    permission
      if (channel.permissionsFor(client.user?.id).has(requiredPermission)) {
         continue;
      }

      // Get the permission name
      const permissionName =
         permissions.find((perm) => perm.value === requiredPermission)?.name ||
         "Permission_Not_Found";

      // Add the missing permissions to the missing permissions array
      missingPermissions.push(permissionName);
   }

   if (missingPermissions.length) {
      // Get the missing permission's gif
      const gifObject = config.permission_urls.find(
         (obj) => obj.name === missingPermissions[0]
      ) || { name: null, url: null };

      // Reply to the interaction
      interaction.reply({
         ephemeral: true,
         embeds: [
            new EmbedBuilder()
               .setColor(config.embedColor)
               .setTitle("❌ Missing Permissions")
               .setDescription(
                  `Woah, I am missing very important permissions in your **bump channel**! Please add the following permissions to **${client.user.username}** in <#${bumpInfo.channelId}>.`
               )
               .setFields({
                  name: "** **",
                  value: `> \`${missingPermissions.join("`, `")}\``,
               })
               .setImage(gifObject.url),
         ],
      });

      return false;
   }

   return true;
};
