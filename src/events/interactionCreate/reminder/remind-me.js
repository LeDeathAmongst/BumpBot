module.exports = async (interaction, instance) => {
   const ids = interaction.customId?.split("_") || [""];

   if (ids[0] !== "reminder") {
      return;
   }

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-reminder");
   instance.commandHandler?.runCommand(command, [ids[1]], null, interaction);
};
