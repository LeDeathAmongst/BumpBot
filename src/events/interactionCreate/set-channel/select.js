module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-channel-select") {
      return;
   }

   // Set the channel
   const bumpInfo = await instance.client.bumpInfos.setChannel(
      interaction.guild.id,
      interaction.values[0]
   );

   // Fetch the command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-channel");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
