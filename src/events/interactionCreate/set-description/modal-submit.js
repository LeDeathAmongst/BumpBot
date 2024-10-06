const { TextInputStyle, TextInputBuilder } = require("discord.js");

module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-description-modal-submit") {
      return;
   }

   // Get the description from the modal
   const description = interaction.fields.getTextInputValue("description");

   // Set the description
   const bumpInfo = await instance.client.bumpInfos.setDescription(
      interaction.guild.id,
      description
   );

   // Fetch the set-description command from the command handler and run the command
   const command = instance.commandHandler?.commands.get("set-description");
   instance.commandHandler?.runCommand(command, [], null, interaction);
};
