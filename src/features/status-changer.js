const { ActivityType } = require("discord.js");
const config = require("../config.json");

module.exports = async (instance, client) => {
   // Get the statuses from the config
   let statuses = config.statuses;

   let guilds;
   let index = 0;
   let guildCount = 0;
   let memberCount = 0;

   const updateStatuses = () => {
      if (statuses.length === 0) {
         client.user?.setPresence({
            activities: undefined,
         });

         setTimeout(updateStatuses, 1000 * 10);
         return;
      }

      if (index >= statuses.length) {
         index = 0;
      }

      const status = statuses[index];

      // Format the text
      let text = status.text;

      guilds = client.guilds.cache;

      // Check for GUILD_COUNT
      if (text.indexOf("{GUILD_COUNT}") >= 0) {
         // Get the guild count
         guildCount = guilds.size;

         // Update the text
         text = text.replace(/{GUILD_COUNT}/g, guildCount);
      }

      // Check for MEMBER_COUNT
      if (text.indexOf("{MEMBER_COUNT}") >= 0) {
         // Count the number of members
         memberCount = 0;
         for (const [id, guild] of guilds) {
            memberCount += guild.memberCount;
         }

         text = text.replace(/{MEMBER_COUNT}/g, memberCount);
      }

      // Set the status of the client
      client.user?.setPresence({
         activities: [
            {
               name: text,
               type: ActivityType.valueOf()[status.type],
            },
         ],
      });

      ++index;
      setTimeout(updateStatuses, 1 * 60 * 1000); // Every Minute
   };

   updateStatuses();
};
