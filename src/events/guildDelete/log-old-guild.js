const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

let channel;

module.exports = async (guild, instance) => {
   if (!channel) {
      // Get the log channel
      channel = instance.client.channels.cache.get(config.guild_leave_channel_id);

      if (!channel) {
         console.log(`The "Guild Leave Log Channel" was not found using the provided channel id`);
         return;
      }
   }

   // Send the log message
   channel.send({
      embeds: [
         new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Server Removed!`)
            .setThumbnail(guild.iconURL())
            .setFooter({ text: guild.id })
            .addFields(
               {
                  name: "Server Name",
                  value: guild.name,
               },
               {
                  name: "Server Description",
                  value: guild.description || "*No description*",
               },
               {
                  name: "Member Count",
                  value: guild.memberCount.toLocaleString("en"),
                  inline: true,
               },
               {
                  name: "Boost Level",
                  value: guild.premiumTier.toLocaleString("en"),
                  inline: true,
               },
               {
                  name: "Booster Count",
                  value: guild.premiumSubscriptionCount?.toLocaleString("en") || "0",
                  inline: true,
               }
            ),
         new EmbedBuilder()
            .setColor("Red")
            .setDescription(
               `- **${
                  instance.client.guilds.cache.size.toLocaleString("en") || "0"
               } Servers are now using ${instance.client.user.username}!**`
            ),
      ],
   });
};
