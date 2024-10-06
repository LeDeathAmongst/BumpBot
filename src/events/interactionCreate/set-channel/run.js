module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-channel-run") {
      return;
   }

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-channel");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
