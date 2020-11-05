const BaseEmbed = require("../../modules/BaseEmbed");

module.exports = {
  name: "rps",
  description: "Rock Paper Scissors",
  category: "games",
  execute(bot, message) {
    const replies = ["Rock", "Paper", "Scissors"];

    const reply = replies[Math.floor(Math.random() * replies.length)];

    const embed = BaseEmbed(message)
      .setTitle("Rock Paper Scissors")
      .setColor("BLUE")
      .setDescription(`**${reply}**`)
      .setFooter(message.author.username);

    message.channel.send(embed);
  },
};
