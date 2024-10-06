const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

let channel;

module.exports = async (interaction, instance) => {
   // Check if the interaction is a command
   if (!interaction.commandName) {
      return;
   }

   if (!channel) {
      // Get the log channel
      channel = instance.client.channels.cache.get(config.bot_log_channel_id);

      if (!channel) {
         console.log(`The "Bot Log" channel was not found using the provided ID in the config`);
         return;
      }
   }

   channel.send({
      embeds: [
         new EmbedBuilder()
            .setColor(0x44dcdf)
            .setAuthor({
               name: `${interaction.user.username} ran a command`,
               iconURL: interaction.user.displayAvatarURL(),
            })
            .setFields(
               {
                  name: "Command Name",
                  value: `> \`${interaction.commandName}\``,
                  inline: true,
               },
               {
                  name: "User",
                  value: `> \`${interaction.user.username}\``,
                  inline: true,
               },
               {
                  name: "Server",
                  value: `> \`${interaction.guild.name}\` (||${interaction.guild.id}||)`,
                  inline: false,
               }
            ),
      ],
   });
};
