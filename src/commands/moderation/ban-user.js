const { CommandType } = require("wokcommands");
const GenerateBump = require("../../utils/GenerateBump");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
   // Required for slash commands
   description: "Used by Bumps Staff",

   // Create a slash command
   type: CommandType.SLASH,

   testOnly: true,
   ownerOnly: true,

   options: [
      {
         name: "id",
         description: "Toggle notifications",
         type: ApplicationCommandOptionType.String,
         required: true,
         autocomplete: true,
      },
   ],

   autocomplete: (command, argument, interaction) => {
      // Check if the user is staff
      if (!command._instance._botOwners.includes(interaction.user.id)) {
         return ["Missing Permissions"];
      }

      // Get all the users
      const users = [];
      for (const [userId, user] of interaction.client.users.cache) {
         users.push({ name: user.username, value: userId });
      }

      return users;
   },

   // Invoked when a user runs the command
   callback: async ({ client, interaction, args }) => {
      // Check if the argument was provided
      if (!args[0]) {
         return interaction.reply({
            content: "❌ Missing ID argument.",
            ephemeral: true,
         });
      }

      // Check if the user exists
      const user = client.users.cache.get(args[0]);
      if (!user) {
         return interaction.reply({
            content: `❌ User not found with the ID of \`${args[0]}\`.`,
            ephemeral: true,
         });
      }

      // Ban the user
      const result = await client.moderation.banUser(args[0]);

      if (result) {
         // The user was banned
         interaction.reply({
            content: `✅ \`${user?.username || args[0]}\` has been successfully banned!`,
         });
      } else {
         // The user was not banned
         interaction.reply({
            content: `❌ Failed to ban \`${user?.username || args[0]}\`.`,
            ephemeral: true,
         });
      }
   },
};
