const { CommandType } = require("wokcommands");
const BumpEmbed = require("../utils/BumpEmbed");
const {
   ActionRowBuilder,
   ChannelSelectMenuBuilder,
   ChannelType,
   ButtonBuilder,
   ButtonStyle,
   PermissionFlagsBits,
} = require("discord.js");

module.exports = {
   // Required for slash commands
   description: "Set your bump channel!",

   // Create a slash command
   type: CommandType.SLASH,

   permissions: [PermissionFlagsBits.ManageGuild],

   guildOnly: true,

   // Invoked when a user runs the command
   callback: async ({ client, interaction, guild }) => {
      // Get the guild's bump info
      const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

      // Create the description embed
      const channelembed = new BumpEmbed(client)
         .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
         .setTitle("📝 Set Bump Channel")
         .setDescription(
            `> *Please select a channel from the select menu below. To remove your bump channel, please click the Clear button below.*`
         )
         .setFields([
            {
               name: "Current Channel",
               value: bumpInfo.channelId
                  ? `> <#${bumpInfo.channelId}>`
                  : "> *No channel has been selected.*",
            },
         ]);

      // The select menu to select the channel
      const channelSelect = new ActionRowBuilder().addComponents(
         new ChannelSelectMenuBuilder()
            .setCustomId("set-channel-select")
            .setPlaceholder("Please select a bump channel...")
            .setChannelTypes(ChannelType.GuildText)
            .setMaxValues(1)
            .setMinValues(1)
      );

      // Create the clear button
      const buttons = new ActionRowBuilder().addComponents(
         new ButtonBuilder()
            .setEmoji("🗑")
            .setLabel("Clear")
            .setCustomId("set-channel-clear")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(!bumpInfo.channelId)
      );

      // Reply to the user
      const reply = {
         embeds: [channelembed],
         components: [channelSelect, buttons],
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
