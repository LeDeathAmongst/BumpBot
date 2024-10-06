const { Schema, model, models } = require("mongoose");

const guildBanSchema = new Schema({
   // The guild ID
   _id: {
      type: String,
      required: true,
   },
});

const name = "guild-bans";
module.exports = models[name] || model(name, guildBanSchema);
