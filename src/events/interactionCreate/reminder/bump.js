module.exports = async (interaction, instance) => {
   if (interaction.customId !== "reminder-bump") {
      return;
   }

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("bump");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
