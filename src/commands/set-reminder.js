const { CommandType } = require("wokcommands");
const { ApplicationCommandOptionType } = require("discord.js");
const BumpEmbed = require("../utils/BumpEmbed");

module.exports = {
   // Required for slash commands
   description: "Manage your notifications!",

   // Create a slash command
   type: CommandType.SLASH,

   guildOnly: true,

   options: [
      {
         name: "state",
         description: "Toggle notifications",
         type: ApplicationCommandOptionType.String,
         required: true,
         choices: [
            {
               name: "Enabled",
               value: "true",
            },
            {
               name: "Disabled",
               value: "false",
            },
         ],
      },
   ],

   // Invoked when a user runs the command
   callback: async ({ client, interaction, args, member }) => {
      // Set the remind value
      const profile = await client.profiles.setReminder(interaction.user.id, args[0] === "true");

      // Create the bump embed
      const bumpembed = new BumpEmbed(client)
         .setThumbnail(member.user.displayAvatarURL())
         .setTitle("🔔 Bump Reminder")
         .setDescription(
            `*Recieve ping notifications whenever a server is ready to be bumped again!*\n\n> **State:** \`${
               profile.remind ? "Enabled" : "Disabled"
            }\``
         );

      // Reply to the user
      interaction.reply({
         embeds: [bumpembed],
         ephemeral: true,
      });
   },
};
