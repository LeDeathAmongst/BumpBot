const { Schema, model, models } = require("mongoose");

const userBanSchema = new Schema({
   // The user ID
   _id: {
      type: String,
      required: true,
   },
});

const name = "user-bans";
module.exports = models[name] || model(name, userBanSchema);
