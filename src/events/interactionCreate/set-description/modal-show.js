const { TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder } = require("discord.js");

module.exports = async (interaction, instance) => {
   if (interaction.customId !== "set-description-modal-show") {
      return;
   }

   // Get the description from the the bump infos
   const description =
      (await instance.client.bumpInfos.getBumpInfo(interaction.guild.id, {}))?.description || null;

   // Create a text input
   const textInput = new TextInputBuilder()

      .setCustomId("description")
      .setLabel("Please enter a description")
      .setPlaceholder("Explain a little bit of your server...")
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(0)
      .setMaxLength(1200)
      .setRequired(true);

   // Set the description if valid as the default value
   if (description) {
      textInput.setValue(description);
   }

   // Build the modal
   const modal = new ModalBuilder()

      .setCustomId("set-description-modal-submit")
      .setTitle("Edit Description")
      .addComponents(new ActionRowBuilder().addComponents(textInput));

   interaction.showModal(modal);
};
