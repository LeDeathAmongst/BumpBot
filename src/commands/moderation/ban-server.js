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

      // Get all the guilds
      const guilds = [];
      for (const [guildId, guild] of interaction.client.guilds.cache) {
         guilds.push({ name: guild.name, value: guildId });
      }

      return guilds;
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

      // Check if the guild exists
      const guild = client.guilds.cache.get(args[0]);
      if (!guild) {
         return interaction.reply({
            content: `❌ Server not found with the ID of \`${args[0]}\`.`,
            ephemeral: true,
         });
      }

      // Ban the guild
      const result = await client.moderation.banGuild(args[0]);

      if (result) {
         // The guild was banned
         interaction.reply({
            content: `✅ \`${guild?.name || args[0]}\` has been successfully banned!`,
         });
      } else {
         // The guild was not banned
         interaction.reply({
            content: `❌ Failed to ban \`${guild?.name || args[0]}\`.`,
            ephemeral: true,
         });
      }
   },
};
