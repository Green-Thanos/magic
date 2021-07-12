import { Message } from "discord.js";
import Command from "structures/Command";
import Bot from "structures/Bot";
import { time } from "@discordjs/builders";

export default class ServerInfoCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "serverinfo",
      description: "Get info about the server",
      category: "util",
      aliases: ["guild", "server"],
    });
  }

  async execute(message: Message) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);

    try {
      const { guild } = message;

      if (!guild) return message.channel.send({ content: lang.GLOBAL.ERROR });
      if (!message.member) return message.channel.send({ content: lang.GLOBAL.ERROR });

      const { name, memberCount } = guild;
      const roles = this.bot.utils.formatNumber(guild.roles.cache.size);
      const channels = this.bot.utils.formatNumber(guild.channels.cache.size);
      const emojis = this.bot.utils.formatNumber(guild.emojis.cache.size);

      const verLevels = lang.OTHER.VERLEVELS;
      const mfaLevels = lang.OTHER.MFA_LEVELS;

      const joinedAt = message.member?.joinedAt
        ? time(new Date(message.member.joinedAt), "F")
        : "Unknown";

      const owner = await guild.fetchOwner();
      const inviteBanner = guild.bannerURL({
        size: 2048,
        format: "png",
      });

      const verLevel = verLevels[guild.verificationLevel];
      const mfaLevel = mfaLevels[guild.mfaLevel];

      const embed = this.bot.utils
        .baseEmbed(message)
        .setTitle(name)
        .setDescription(
          `
  **${lang.GUILD.OWNER}:** ${owner}
  **${lang.GUILD.MFA}:** ${mfaLevel}
  **${lang.GUILD.VERIFICATION}:** ${verLevel}

  **${lang.MEMBER.JOINED_AT}:** ${joinedAt}
  **${lang.MEMBER.CREATED_ON}:** ${time(new Date(guild.createdAt), "F")}`,
        )
        .addField(
          "**📈 Stats**",
          `
  **${lang.GUILD.ROLES_C}:** ${roles}
  **${lang.GUILD.CHANNEL_C}:** ${channels}
  **${lang.GUILD.EMOJI_C}:** ${emojis}
  **${lang.GUILD.MEMBER_C}:** ${memberCount}`,
        );

      if (inviteBanner !== null) {
        embed.setImage(inviteBanner);
      }

      if (guild.icon !== null) {
        embed.setThumbnail(`${guild.iconURL({ format: "png", size: 1024 })}`);
      }

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send({ content: lang.GLOBAL.ERROR });
    }
  }
}
