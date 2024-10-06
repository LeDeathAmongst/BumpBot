const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = (instance, client) => {
   const channel = client.channels.cache.get(config.bot_log_channel_id);

   if (!channel) {
      console.log(`The "Bot Log" channel was not found using the provided ID in the config`);
      return;
   }

   process.on("unhandledRejection", (reason, p) => {
      channel
         .send({
            embeds: [
               new EmbedBuilder()
                  .setColor("Red")
                  .setTimestamp()
                  .setTitle("Unhandled Rejection has occurred:")
                  .setDescription(`\`\`\`js\n${reason.toString()}\n\`\`\``),
            ],
         })
         .catch(() => null);
   });

   process.on("uncaughtException", (err, origin) => {
      channel
         .send({
            embeds: [
               new EmbedBuilder()
                  .setColor("Red")
                  .setTimestamp()
                  .setTitle("Uncaught Exception has occurred:")
                  .setDescription(`\`\`\`js\n${err.toString()}\n\`\`\``),
            ],
         })
         .catch(() => null);
   });

   process.on("uncaughtExceptionMonitor", (err, origin) => {
      channel
         .send({
            embeds: [
               new EmbedBuilder()
                  .setColor("Red")
                  .setTimestamp()
                  .setTitle("Uncaught Exception Monitor has occurred:")
                  .setDescription(`\`\`\`js\n${err.toString()}\n\`\`\``),
            ],
         })
         .catch(() => null);
   });

   client.on("error", (error) => {
      channel
         .send({
            embeds: [
               new EmbedBuilder()
                  .setColor("Red")
                  .setTimestamp()
                  .setTitle("A new client error has occurred:")
                  .setDescription(`\`\`\`js\n${error.toString()}\n\`\`\``),
            ],
         })
         .catch(() => null);
   });
};
