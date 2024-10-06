const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = class BumpEmbed extends EmbedBuilder {
   constructor(client) {
      super();

      if (!client) {
         throw new Error("Client is required for creating a Bump Embed");
      }

      this.setColor(config.embedColor)
         .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
         .setImage(config.bannerURL)
         .setTimestamp();
   }
};
