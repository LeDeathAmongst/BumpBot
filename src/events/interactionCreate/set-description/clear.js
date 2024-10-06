module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-description-clear") {
      return;
   }

   // Set the description
   const bumpInfo = await instance.client.bumpInfos.setDescription(interaction.guild.id, null);

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-description");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
