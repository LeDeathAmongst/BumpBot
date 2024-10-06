const { CommandType } = require("wokcommands");
const GenerateBump = require("../utils/GenerateBump");

module.exports = {
   // Required for slash commands
   description: "Preview your bump message!",

   // Create a slash command
   type: CommandType.SLASH,

   guildOnly: true,

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      // Create the bump embed
      const bumpmessage = await GenerateBump(client, guild);

      try {
         interaction.update(bumpmessage);
      } catch {
         interaction.reply({
            ...bumpmessage,
            ephemeral: true,
         });
      }
   },
};
