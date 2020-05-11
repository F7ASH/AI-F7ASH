const Command = require("../../lib/structures/Command");
const fetch = require("node-fetch");

class osuCommand extends Command {
  constructor(...args) {
    super(...args, {
      args: "<profile:string>",
      description: "Displays info about an osu! account.",
      requiredkeys: ["osu"],
      cooldown: 3,
      allowdms: true,
    });
  }

  async run(msg, args) {
    // Number formatting
    const formatNumber = num => Number.parseFloat(num).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    // Finds the player
    const user = args.join(" ");
    const res = await fetch(`https://osu.ppy.sh/api/get_user?k=${this.bot.key.osu}&u=${user}&type=string`);
    const body = await res.json();
    if (!body.length) return msg.channel.createMessage(this.bot.embed("❌ Error", "Profile not found.", "error"));
    const data = body[0];
    if (!data.pp_raw && !data.playcount && !data.level && !data.accuracy && !data.playcount) {
      return msg.channel.createMessage(this.bot.embed("❌ Error", "The user you searched for has no data.", "error"));
    }

    // Sets the fields
    const fields = [];
    fields.push({ name: "User ID", value: data.user_id, inline: true });
    if (data.pp_raw > 0) fields.push({ name: "PP", value: data.pp_raw, inline: true });
    if (data.pp_rank > 0) fields.push({ name: "Global Ranking", value: data.pp_rank, inline: true });
    if (data.pp_country_rank > 0) fields.push({ name: "Country Rank", value: `${data.pp_country_rank} :flag_${data.country.toLowerCase()}:`, inline: true });
    if (data.level > 0) fields.push({ name: "Level", value: formatNumber(data.level), inline: true });
    if (data.accuracy > 0) fields.push({ name: "Accuracy", value: `${Math.round(data.accuracy)}%`, inline: true });
    if (data.playcount > 0) fields.push({ name: "Plays", value: formatNumber(data.playcount), inline: true });
    if (data.total_score > 0) fields.push({ name: "Total Score", value: data.total_score, inline: true });
    if (data.join_date) fields.push({ name: "Join Date", value: data.join_date, inline: true });

    // Sends the embed
    msg.channel.createMessage({
      embed: {
        color: this.bot.embed.color("general"),
        fields: fields,
        author: {
          name: data.username,
          icon_url: `https://a.ppy.sh/${data.user_id}?ifyouseethisyoureallyneedtogetalife.png` || "https://i.imgur.com/tRXeTcU.png",
          url: `https://osu.ppy.sh/users/${data.user_id}`,
        },
        thumbnail: {
          url: `https://a.ppy.sh/${data.user_id}?ifyouseethisyoureallyneedtogetalife.png` || "https://i.imgur.com/tRXeTcU.png",
        },
      },
    });
  }
}

module.exports = osuCommand;
