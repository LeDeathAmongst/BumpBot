const { Schema, model, models } = require("mongoose");

const profilesSchema = new Schema({
   // The user ID
   _id: {
      type: String,
      required: true,
   },

   // Have they turned on notifications
   remind: {
      type: Boolean,
      required: true,
      default: true,
   },
});

const name = "profiles";
module.exports = models[name] || model(name, profilesSchema);
