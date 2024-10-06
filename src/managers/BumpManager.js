const GenerateBump = require("../utils/GenerateBump");
const config = require("../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = class BumpManager {
   constructor(client) {
      // The bot instance
      this.client = client;

      // Get the bump log channel
      this.bumpLogChannel = client.channels.cache.get(config.bump_log_channel_id);
      if (!this.bumpLogChannel) {
         console.log(`The "Bump Log" channel was not found using the provided ID in the config`);
      }

      // The Bump Queue
      this.queue = [];

      // Bump a server every 10 seconds
      setInterval(async () => {
         if (!this.queue.length) {
            return;
         }

         // Get the id of the first guild in the queue and remove them from the queue
         const bump = this.queue.shift();

         // Bump the first guild in the queue
         try {
            await this.sendBump(bump.guildId, bump.channelId, bump.userId);
         } catch (err) {
            throw new Error(`Failed to bump guild "${bump.guildId}"`, err);
         }
      }, 10 * 1000);
   }

   /**
    * Add a guild to the bump queue
    * @param {String} [guildId] the guild id
    * @param {String} [channelId] the channel id
    * @param {String} [userId] the user id
    */
   async addBump(guildId, channelId, userId) {
      if (!guildId) {
         throw new SyntaxError("The guild ID is required to add the guild to the bump queue");
      }

      if (!channelId) {
         throw new SyntaxError("The channel ID is required to add the guild to the bump queue");
      }

      if (!userId) {
         throw new SyntaxError("The user ID is required to add the guild to the bump queue");
      }

      // Add the guild to the queue
      this.queue.push({ guildId, channelId, userId });

      // Log the bump
      this.logBump(guildId, userId);
   }

   /**
    * Send a bump across other guilds
    * @param {String} [guildId] the guild id
    * @param {String} [channelId] the channel id
    * @param {String} [userId] the user id
    */
   async sendBump(guildId, channelId, userId) {
      if (!guildId) {
         throw new SyntaxError("The guild ID is required to send a bump");
      }

      if (!channelId) {
         throw new SyntaxError("The channel ID is required to send a bump");
      }

      if (!userId) {
         throw new SyntaxError("The userId ID is required to send a bump");
      }

      // Fetch the guild
      const guild = await this.client.guilds.fetch(guildId);
      if (!guildId) {
         throw new Error(`Cannot find guild "${guildName}"`);
      }

      // Update the bump info
      await this.client.bumpInfos.setLastBumped(guildId, channelId, userId);

      // Generate the bump message
      const bumpmessage = await GenerateBump(this.client, guild).catch((err) => {
         throw new Error(`Failed to generate Bump message for "${guild.name}" (${guildId})`, err);
      });

      // Get all the servers
      for (const [_id, bumpInfo] of this.client.bumpInfos.cache) {
         // Check if the server has set it's bump channel
         if (!bumpInfo.channelId) continue;

         // Get the guilds' bump channel
         const channel = this.client.channels.cache.get(bumpInfo.channelId);
         if (!channel) continue;

         // Send the message
         channel.send(bumpmessage).catch(() => null);
      }
   }

   /**
    * Send a bump log to a channel
    * @param {String} [guildId] the guild id
    * @param {String} [userId] the user id
    */
   async logBump(guildId, userId) {
      // Check if all parameters where provided
      if (!guildId) throw new SyntaxError("The guild ID is required to log a bump");
      if (!userId) throw new SyntaxError("The userId ID is required to log a bump");

      // Check if the bump log channel exists
      if (!this.bumpLogChannel) return;

      // Get the guild
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return;

      // Get the user
      const user = this.client.users.cache.get(userId);
      if (!user) return;

      // SEnd the bump log to the channel
      this.bumpLogChannel.send({
         embeds: [
            new EmbedBuilder().setColor(0x44dcdf).setAuthor({
               name: `${guild?.name || "Unknown Server"} has been bumped by ${
                  user?.username || "Unknown User"
               }`,
               iconURL: guild?.iconURL(),
            }),
         ],
      });
   }
};
