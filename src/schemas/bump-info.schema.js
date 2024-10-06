const { Schema, model, models } = require("mongoose");

const bumpInfoSchema = new Schema({
   // The guild ID
   _id: {
      type: String,
      required: true,
   },

   // The bump channel
   channelId: {
      type: String,
      required: true,
      default: null,
   },

   // The guild's advert description
   description: {
      type: String,
      required: true,
      default: null,
   },

   // The banner URL
   imageUrl: {
      type: String,
      required: true,
      default: null,
   },

   // The color of the embed
   color: {
      type: String,
      required: true,
      default: null,
   },

   // The guild's invite link
   inviteLink: {
      type: String,
      required: true,
      default: null,
   },

   // Who last bumped the guild
   lastBumpedBy: {
      userId: {
         type: String,
         required: false,
         default: null,
      },
      channelId: {
         type: String,
         required: false,
         default: null,
      },
   },

   // How many times has this guild been bumped
   bumpCount: {
      type: Number,
      required: true,
      default: 0,
   },
});

const name = "bump-info";
module.exports = models[name] || model(name, bumpInfoSchema);
