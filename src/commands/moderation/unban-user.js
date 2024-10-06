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
      if (!command._instance._botOwners.includes(interaction.user.id)) {
         return ["Missing Permissions"];
      }

      const guilds = [];
      for (const [guildId, guild] of interaction.client.guilds.cache) {
         guilds.push({ name: guild.name, value: guildId });
      }

      return guilds;
   },

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      const reply = { content: "Testing" };

      try {
         interaction.update(reply);
      } catch {
         interaction.reply({
            ...reply,
            ephemeral: true,
         });
      }
   },
};
