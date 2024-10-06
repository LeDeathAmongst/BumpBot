module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-description-run") {
      return;
   }

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-description");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
