const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../../../config.json");

const requiredPermissions = [PermissionFlagsBits.ManageGuild];
const permissions = Object.entries(PermissionFlagsBits).map((perm) => ({
   name: perm[0],
   value: perm[1],
}));

module.exports = async (command, usage) => {
   if (command.commandName !== "set-channel") {
      return true;
   }

   const { interaction, guild, client } = usage;

   // Check if the client has all the required permissions
   let missingPermissions = [];
   for (const requiredPermission of requiredPermissions) {
      // Check if the client has the required permission
      if (guild.members.cache.get(client.user?.id)?.permissions.has(requiredPermission)) {
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
                  `Woah, I am missing very important permissions in this **server**! Please add the following permissions to **${client.user.username}**.`
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
