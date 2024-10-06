/*

   🔥 Repository:

   📚 Documentation:

   Permissions: Create Invites, Manage Server

*/

// Imports
const { Client, IntentsBitField } = require("discord.js");
const BumpInfoManager = require("./managers/BumpInfoManager");
const ProfileManager = require("./managers/ProfileManager");
const BumpManager = require("./managers/BumpManager");
const path = require("path");
const WOKCommands = require("wokcommands");
const config = require("./config.json");
const ModManager = require("./managers/ModManager");

// Register the environment variables
require("dotenv").config();

// Create a new client instance
const client = new Client({
   intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildInvites],
});

client.on("ready", async (client) => {
   // Create a new instance of the Bump Info Manager
   client.bumpInfos = new BumpInfoManager(client);

   // Create a new instance of the Profiles Manager
   client.profiles = new ProfileManager();

   // Create a new instance of the Bump Manager
   client.bumps = new BumpManager(client);

   // Create a new instance of the Mod Manager
   client.moderation = new ModManager();

   // Create a new instance of the command handler
   await new WOKCommands({
      client,
      mongoUri: process.env.MONGO_URI,
      defaultPrefix: "!",

      commandsDir: path.join(__dirname, "commands"),
      featuresDir: path.join(__dirname, "features"),
      events: {
         dir: path.join(__dirname, "events"),
      },
      validations: {
         runtime: path.join(__dirname, "validations", "runtime"),
         // syntax: join(__dirname, "validations", "syntax"),
      },

      testServers: config.testServerIds,
      botOwners: config.botOwnerIds,

      disabledDefaultCommands: [
         WOKCommands.DefaultCommands.ChannelCommand,
         WOKCommands.DefaultCommands.CustomCommand,
         WOKCommands.DefaultCommands.Prefix,
         WOKCommands.DefaultCommands.RequiredPermissions,
         WOKCommands.DefaultCommands.RequiredRoles,
         WOKCommands.DefaultCommands.ToggleCommand,
      ],
   });

   console.log(`${client.user.username} is ready`);
});

client.login(process.env.TOKEN);
