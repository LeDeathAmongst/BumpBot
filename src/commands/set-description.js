const { CommandType } = require("wokcommands");
const BumpEmbed = require("../utils/BumpEmbed");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
   // Required for slash commands
   description: "Set your server's description!",

   // Create slash command
   type: CommandType.SLASH,

   permissions: [PermissionFlagsBits.ManageGuild],

   guildOnly: true,

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      // Get the guild's bump info
      const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

      // Create the description embed
      const descriptionembed = new BumpEmbed(client)
         .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
         .setTitle("📝 Set Description")
         .setDescription(`> ${bumpInfo.description || "*A description has not been set.*"}`);

      // Create the edit button
      const buttons = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
            .setEmoji("✏")
            .setLabel("Edit")
            .setCustomId("set-description-modal-show")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false),

         new ButtonBuilder()
            .setEmoji("🗑")
            .setLabel("Clear")
            .setCustomId("set-description-clear")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(!bumpInfo.description)
      );

      // Reply to the user
      const reply = {
         embeds: [descriptionembed],
         components: [buttons],
      };
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
