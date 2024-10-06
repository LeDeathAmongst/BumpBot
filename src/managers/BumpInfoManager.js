const bumpInfoSchema = require("../schemas/bump-info.schema");
const config = require("../config.json");

module.exports = class BumpInfoManager {
   constructor(client) {
      // The bot instance
      this.client = client;

      // The Bump Info cache
      this.cache = new Map();

      // Create a default bump info
      this.defaultBumpInfo = {
         _id: "",
         channelId: null,
         description: null,
         imageUrl: config.bannerURL,
         color: config.embedColor,
         inviteLink: null,
         bumpCount: 0,
         lastBumpedBy: {
            userId: null,
            channelId: null,
         },
      };

      // Fetch Bump Infos from DB
      this.fetchBumpInfos();
   }

   // Fetch all the bump infos from the DB and cache it
   async fetchBumpInfos() {
      // Fetch all the bump infos from the DB
      const bumpInfos = await bumpInfoSchema.find({});

      // Cache the DB results
      for (const bumpInfo of bumpInfos) {
         this.cache.set(bumpInfo._id, bumpInfo);
      }
   }

   /**
    * Get the total number of bumps
    * @returns {number}
    */
   async getBumpCount() {
      return (
         await bumpInfoSchema.aggregate([
            { $group: { _id: null, bumpCount: { $sum: "$bumpCount" } } },
         ])
      )[0].bumpCount;
   }

   /**
    * Get the top servers using the bot
    * @returns {BumpInfo[]}
    */
   async getLeaderboard() {
      return await bumpInfoSchema.find({}).sort({ bumpCount: -1 }).limit(10);
   }

   /**
    * Get the bump information for a given guild ID
    * @param {string} [id] the guild id
    * @returns {BumpInfo}
    */
   async getBumpInfo(id) {
      if (!id) {
         throw new Error("The guild ID is required to get the bump info");
      }

      // Fetch from the cache
      const info = this.cache.get(id);

      if (info) {
         // Return the cached bump info
         return info._doc || info;
      }

      // Fetch from the database
      let result = await bumpInfoSchema.findOne({ _id: id });
      if (!result) {
         return {
            ...this.defaultBumpInfo,
            _id: id,
         };
      }

      // Make sure that the result is in a readable format
      if (result._doc) {
         result = result._doc;
      }

      // Cache the result from the database
      this.cache.set(id, result);

      return result;
   }

   /**
    * Set the bump channel id of the guild
    * @param {string} [id] the guild id
    * @param {string | null} [channelId] the channel id of the bump channel
    */
   async setChannel(id, channelId) {
      if (!id) {
         throw new Error("The guild ID is required to set a bump channel");
      }

      // Create an invite code for the given channel id
      const inviteLink = channelId ? await this.createInvite(id, channelId) : null;

      // Save the invite link before it deletes it again
      await this.setInvite(id, inviteLink);

      // Delete any unused invite links
      await this.deleteInvites(id);

      // Get the bump info
      let bumpInfo = (await this.getBumpInfo(id)) || null;

      // Create the new bump info object
      if (bumpInfo) {
         bumpInfo = {
            ...bumpInfo,
            channelId,
         };
      } else {
         bumpInfo = {
            ...this.defaultBumpInfo,
            _id: id,
            channelId,
         };
      }

      // Save the bump info to the cache
      this.cache.set(id, bumpInfo);

      // Save the bump info to the database
      await bumpInfoSchema.findOneAndUpdate(
         { _id: id },
         {
            _id: bumpInfo._id,
            channelId: bumpInfo.channelId,
            description: bumpInfo.description,
            imageUrl: bumpInfo.imageUrl,
            color: bumpInfo.color,
            inviteLink: bumpInfo.inviteLink,
            lastBumpedBy: bumpInfo.lastBumpedBy,
            bumpCount: bumpInfo.bumpCount,
         },
         {
            upsert: true,
         }
      );

      return bumpInfo;
   }

   /**
    * Set the description of the guild
    * @param {string} [id] the guild id
    * @param {string | null} [description] the guild's description
    */
   async setDescription(id, description) {
      if (!id) {
         throw new Error("The guild ID is required to set a description");
      }

      // Get the bump info
      let bumpInfo = (await this.getBumpInfo(id)) || null;

      // Create the new bump info object
      if (bumpInfo) {
         bumpInfo = {
            ...bumpInfo,
            description,
         };
      } else {
         bumpInfo = {
            ...this.defaultBumpInfo,
            _id: id,
            description,
         };
      }

      // Save the bump info to the cache
      this.cache.set(id, bumpInfo);

      // Save the bump info to the database
      await bumpInfoSchema.findOneAndUpdate(
         { _id: id },
         {
            guildId: bumpInfo.guildId,
            channelId: bumpInfo.channelId,
            description: bumpInfo.description,
            imageUrl: bumpInfo.imageUrl,
            color: bumpInfo.color,
            inviteLink: bumpInfo.inviteLink,
            lastBumpedBy: bumpInfo.lastBumpedBy,
            bumpCount: bumpInfo.bumpCount,
         },
         { upsert: true }
      );

      return bumpInfo;
   }

   /**
    * Set the invite link for the guild
    * @param {string} [id] the guild id
    * @param {string | null} [invite] the guild's invite link
    */
   async setInvite(id, inviteLink) {
      if (!id) {
         throw new Error("The guild ID is required to set a description");
      }

      // Get the bump info
      let bumpInfo = (await this.getBumpInfo(id)) || null;

      // Create the new bump info object
      if (bumpInfo) {
         bumpInfo = {
            ...bumpInfo,
            inviteLink,
         };
      } else {
         bumpInfo = {
            ...this.defaultBumpInfo,
            _id: id,
            inviteLink,
         };
      }

      // Save the bump info to the cache
      this.cache.set(id, bumpInfo);

      // Save the bump info to the database
      await bumpInfoSchema.findOneAndUpdate(
         { _id: id },
         {
            guildId: bumpInfo.guildId,
            channelId: bumpInfo.channelId,
            description: bumpInfo.description,
            imageUrl: bumpInfo.imageUrl,
            color: bumpInfo.color,
            inviteLink: bumpInfo.inviteLink,
            lastBumpedBy: bumpInfo.lastBumpedBy,
            bumpCount: bumpInfo.bumpCount,
         },
         { upsert: true }
      );

      return bumpInfo;
   }

   /**
    * Create the invite link for the guild
    * @param {string} [id] the guild id
    * @param {string | null} [channelId] the channel invite id
    * @returns {string | null} the invite link
    */
   async createInvite(id, channelId) {
      if (!id || !channelId) {
         throw new Error("The guild ID and the channel ID is required to create an invite link");
      }

      // Fetch the guild
      const guild = await this.client.guilds.fetch(id);
      if (!guild) {
         return null;
      }

      // Fetch all the invites
      const invites = await guild.invites.fetch().catch(() => null);
      if (!invites) {
         return null;
      }

      // Determine which invites are reusable
      for (const [code, invite] of invites) {
         // Check if the link expires
         if (invite.maxAge <= 0 || invite.temporary || invite.maxUses <= 0) {
            continue;
         }

         // Check if the channel ID is the same
         if (invite.channelId !== channelId) {
            continue;
         }

         // Check if the author is the bot
         if (invite.inviterId !== this.client.user.id) {
            continue;
         }

         return `https://discord.gg/${code}`;
      }

      // Create the invite link
      return await guild.invites
         .create(channelId, {
            maxAge: 0,
            maxUses: 0,
            reason: "Auto invite link create",
            unique: true,
         })
         .then((invite) => `https://discord.gg/${invite.code}`)
         .catch(() => null);
   }

   /**
    * Delete all unused invite links that are created by the bot in the guild
    * @param {string} [id] the guild id
    * @returns {number} how many invite links were deleted
    */
   async deleteInvites(id) {
      if (!id) {
         throw new Error("The guild ID is required to delete invite links");
      }

      // Get the bump info
      let bumpInfo = await this.getBumpInfo(id);

      // Fetch the guild
      const guild = await this.client.guilds.fetch(id);
      if (!guild) {
         return null;
      }

      // Fetch all the invites
      const invites = await guild.invites.fetch().catch(() => null);
      if (!invites) {
         return null;
      }

      // Determine which invites are unusable
      let deleteCount = 0;
      for (const [code, invite] of invites) {
         // Check if the author is the bot as we are only concerned about the bot's invites
         if (invite.inviterId !== this.client.user.id) {
            continue;
         }

         // Check if the invite has any uses
         if (invite.uses > 0) {
            continue;
         }

         // Check if the invite is the current invite link
         if (`https://discord.gg/${code}` === bumpInfo.inviteLink) {
            continue;
         }

         // Delete the unusable invite
         await guild.invites.delete(invite, "Unnecessary Invite Link");
         deleteCount++;
      }

      return deleteCount;
   }

   /**
    * Update who last bumped the guild
    * @param {string} [guildId] the guild id
    * @param {string} [channelId] the channel id
    * @param {string} [userId] the user id
    */
   async setLastBumped(guildId, channelId, userId) {
      if (!guildId) {
         throw new Error("The guild ID is required to set the last bumped");
      }

      // Get the bump info
      let bumpInfo = (await this.getBumpInfo(guildId)) || null;

      // Create the new bump info object
      if (bumpInfo) {
         bumpInfo = {
            ...bumpInfo,
            lastBumpedBy: { userId, channelId },
            bumpCount: bumpInfo.bumpCount + 1,
         };
      } else {
         bumpInfo = {
            ...this.defaultBumpInfo,
            _id: guildId,
            lastBumpedBy: { userId, channelId },
            bumpCount: 1,
         };
      }

      // Save the bump info to the cache
      this.cache.set(guildId, bumpInfo);

      // Save the bump info to the database
      await bumpInfoSchema.findOneAndUpdate(
         { _id: guildId },
         {
            guildId: bumpInfo.guildId,
            channelId: bumpInfo.channelId,
            description: bumpInfo.description,
            imageUrl: bumpInfo.imageUrl,
            color: bumpInfo.color,
            inviteLink: bumpInfo.inviteLink,
            lastBumpedBy: bumpInfo.lastBumpedBy,
            bumpCount: bumpInfo.bumpCount,
         },
         { upsert: true }
      );

      return bumpInfo;
   }
};
