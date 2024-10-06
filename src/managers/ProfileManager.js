const profilesSchema = require("../schemas/profiles.schema");

module.exports = class ProfileManager {
   constructor() {
      // The Profile cache
      this.cache = new Map();

      // Create a default profile
      this.defaultProfile = {
         _id: "",
         remind: true,
      };

      this.fetchProfiles();
   }

   // Fetch all profiles and cache it
   async fetchProfiles() {
      // Fetch all the profiles from the DB
      const profiles = await profilesSchema.find({});

      // Cache the DB results
      for (const profile of profiles) {
         this.cache.set(profile._id, profile);
      }
   }

   /**
    * Get a user's profile
    * @param {string} id the user ID
    */
   async getProfile(id) {
      // Fetch from the cache
      const profile = this.cache.get(id);

      if (profile) {
         return profile._doc || profile;
      }

      // Fetch from the database
      let result = await profilesSchema.findOne({ _id: id });
      if (!result) {
         return {
            ...this.defaultProfile,
            _id: id,
         };
      }

      if (result._doc) {
         result = result._doc;
      }

      // Cache the result from the database
      this.cache.set(id, result);

      return result;
   }

   /**
    * Set a user's reminder state
    * @param {string} id the user ID
    * @param {boolean} remind the reminder state
    */
   async setReminder(id, remind) {
      // Get the user's profile
      let profile = (await this.getProfile(id)) || null;

      // Create a new Profile if not found
      if (profile) {
         profile = {
            ...profile,
            remind,
         };
      } else {
         profile = {
            ...this.defaultProfile,
            _id: id,
            remind,
         };
      }

      // Save the profile to the cache
      this.cache.set(id, profile);

      // Save the profile to the database
      await profilesSchema.findOneAndUpdate(
         { _id: id },
         {
            _id: profile._id,
            remind: profile.remind,
         },
         {
            upsert: true,
         }
      );

      return profile;
   }
};
