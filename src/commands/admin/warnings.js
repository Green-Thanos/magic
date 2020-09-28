const { MessageEmbed } = require("discord.js");
const { getWarningUsers, getServerPrefix } = require("../../utils/functions");

module.exports = {
  name: "warnings",
  description: "Returns how many warnings a user has",
  category: "admin",
  async execute(bot, message, args) {
    const guildId = message.guild.id;
    const warningNr = args[1];
    const member =
      message.guild.member(message.mentions.users.first()) ||
      message.guild.members.cache.get(args[0]);

    if (!member) {
      return message.channel.send("Please provide a valid user");
    }

    const prefix = await getServerPrefix(guildId);
    const users = (await getWarningUsers(guildId)) || [];
    const warnings = users.filter((w) => w.user.id === member.user.id);

    let embed = new MessageEmbed()
      .setColor("BLUE")
      .setTimestamp()
      .setFooter(message.author.username);

    if (warningNr) {
      const warning = warnings.filter((w, idx) => idx === warningNr - 1)[0];

      if (!warning) {
        return message.channel.send(
          `warning wasn't found or ${member.user.tag} doesn't have any warnings`
        );
      }

      embed
        .setTitle(`Warning: ${warningNr}`)
        .addField("**Reason**", warning.reason);

      return message.channel.send({ embed });
    }

    embed
      .setTitle(`${member.user.tag}'s warnings`)
      .addField("**Total warnings**", warnings.length)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `Use \`${prefix}warnings <user> <warning number>\` to view more info about a specific warning `
      );

    message.channel.send({ embed });
  },
};
