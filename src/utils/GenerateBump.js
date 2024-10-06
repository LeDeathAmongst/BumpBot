const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const BumpEmbed = require("./BumpEmbed");
const config = require("../config.json");

module.exports = async (client, guild) => {
   // Get the guild's bump info
   const bumpInfo = await client.bumpInfos.getBumpInfo(guild.id);

   // Fetch the user who bumped this guild
   const lastBumpedBy = bumpInfo.lastBumpedBy?.userId
      ? await guild.members.fetch(bumpInfo.lastBumpedBy.userId)
      : { user: { username: "Nobody" }, displayAvatarURL: () => null };

   // Create the bump message that contains the invite link, embed, and buttons
   return {
      content: `> 🔗 ${
         bumpInfo.inviteLink || `[No invite link was found](${config.support_invite})`
      }`,
      embeds: [
         new BumpEmbed(client)
            .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
            .setThumbnail(guild.iconURL())
            .setDescription(
               `\`\`\` 📚 Description \`\`\`\n${
                  bumpInfo.description || "> *No description was found for this server*"
               }\n\`\`\` 👉 Details \`\`\``
            )
            .setFooter({
               text: `Bumped by ${lastBumpedBy.user.username}`,
               iconURL: lastBumpedBy.displayAvatarURL(),
            })
            .setFields(
               {
                  name: "⏳ Created",
                  value: `> <t:${Math.floor(new Date(guild.createdAt).getTime() / 1000)}:R>`,
                  inline: true,
               },
               {
                  name: "🔥 Members",
                  value: `> ${guild.memberCount.toLocaleString("en")}`,
                  inline: true,
               },
               {
                  name: "💎 Boosters",
                  value: `> ${guild.premiumSubscriptionCount?.toLocaleString("en") || 0}`,
                  inline: true,
               },
               {
                  name: "🚀 Bump Count",
                  value: `> ${bumpInfo.bumpCount?.toLocaleString("en") || 0}`,
                  inline: true,
               }
            ),
      ],
      components: [
         new ActionRowBuilder().addComponents(
            // Join Server Button
            new ButtonBuilder()
               .setEmoji("➕")
               .setLabel("Join Server")
               .setURL(bumpInfo.inviteLink || config.support_invite)
               .setStyle(ButtonStyle.Link)
               .setDisabled(false),

            // Add Bot Button
            new ButtonBuilder()
               .setEmoji("🧪")
               .setLabel("Add Bot")
               .setURL(config.bot_invite_url)
               .setStyle(ButtonStyle.Link)
               .setDisabled(false)
         ),
      ],
   };
};
