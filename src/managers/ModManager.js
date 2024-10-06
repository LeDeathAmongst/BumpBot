const guildBanSchema = require("../schemas/guild-ban.schema");
const userBanSchema = require("../schemas/user-ban.schema");

module.exports = class ModManager {
   constructor() {
      // The guild ban cache
      this.guildCache = [];

      // The user ban cache
      this.userCache = [];

      // Fetch all bans
      this.fetchBans();

      // Watch for changes to the DB for Guild Bans
      guildBanSchema.watch().on("change", async (data) => {
         const { operationType } = data;

         if (operationType === "insert") {
            // Cache the ban
            this.guildCache.push(data.fullDocument._id);
         } else if (operationType === "delete") {
            // Uncache the ban
            this.guildCache = this.guildCache.filter((guildId) => guildId !== data.documentKey._id);
         }
      });

      // Watch for changes to the DB for User Bans
      userBanSchema.watch().on("change", async (data) => {
         const { operationType } = data;

         if (operationType === "insert") {
            // Cache the ban
            this.userCache.push(data.fullDocument._id);
         } else if (operationType === "delete") {
            // Uncache the ban
            this.userCache = this.userCache.filter((userId) => userId !== data.documentKey._id);
         }
      });
   }

   /**
    * Fetch all bans and cache it
    */
   async fetchBans() {
      // Fetch all the guild bans from the DB
      const guildBans = await guildBanSchema.find({});

      // Cache the DB results
      for (const ban of guildBans) {
         this.guildCache.push(ban._id);
      }

      // Fetch all the user bans from the DB
      const userBans = await userBanSchema.find({});

      // Cache the DB results
      for (const ban of userBans) {
         this.userCache.push(ban._id);
      }
   }

   /**
    * Check if the user or guild is banned
    * @param {string} id the user or guild ID
    */
   isBanned(id) {
      return this.guildCache.includes(id) || this.userCache.includes(id);
   }

   /**
    * Ban a guild from using SkyBumps
    * @param {string} id the guild ID
    */
   async banGuild(id) {
      if (!id) return false;

      try {
         // Create a new item in the DB
         await new guildBanSchema({
            _id: id,
         }).save();

         return true;
      } catch {
         return false;
      }
   }

   /**
    * unban a guild from SkyBumps
    * @param {string} id the guild ID
    */
   async unbanGuild(id) {
      if (!id) return false;

      try {
         // Find and Delete the guild from the ban list
         await guildBanSchema.findOneAndDelete({ _id: id });

         return true;
      } catch {
         return false;
      }
   }

   /**
    * Ban a user from using SkyBumps
    * @param {string} id the user ID
    */
   async banUser(id) {
      if (!id) return false;

      try {
         // Create a new item in the DB
         await new userBanSchema({
            _id: id,
         }).save();

         return true;
      } catch {
         return false;
      }
   }

   /**
    * Unban a user from SkyBumps
    * @param {string} id the user ID
    */
   async unbanUser(id) {
      if (!id) return false;

      try {
         // Find and Delete the guild from the ban list
         await userBanSchema.findOneAndDelete({ _id: id });

         return true;
      } catch {
         return false;
      }
   }
};
