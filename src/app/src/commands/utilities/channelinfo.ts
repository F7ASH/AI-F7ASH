import type { CommandInteraction, EmbedField, ApplicationCommandOptionData } from "discord.js";
import { HibikiCommand } from "../../classes/Command";
import { localiseChannelType } from "../../utils/localiser";
import { createFullRelativeTimestamp } from "../../utils/timestamp";

export class ChannelinfoCommand extends HibikiCommand {
  description = "Returns information about a channel.";
  options: ApplicationCommandOptionData[] = [
    {
      type: 7,
      name: "channel",
      description: "The channel to get information about.",
      required: true,
    },
  ];

  public async run(interaction: CommandInteraction) {
    // Gets the raw channel info
    const channel = interaction.options.getChannel(this.options[0].name);

    // Handler for if a channel failed to fetch
    if (!channel) {
      return interaction.reply({
        embeds: [
          {
            title: interaction.getLocaleString("global.ERROR"),
            description: interaction.getLocaleString("general.COMMAND_CHANNELINFO_FAILED"),
            color: this.bot.config.colours.error,
            footer: {
              text: interaction.getLocaleString("global.RAN_BY", { tag: interaction.user.tag }),
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            },
          },
        ],
      });
    }

    // Gets guild channel info
    const guildChannel = await interaction.guild?.channels.fetch(channel.id);
    const fields: EmbedField[] = [];

    // ID
    fields.push({
      name: interaction.getLocaleString("global.ID"),
      value: channel.id,
      inline: true,
    });

    // Category
    if (guildChannel?.parent) {
      fields.push({
        name: interaction.getLocaleString("global.CATEGORY"),
        value: guildChannel.parent.name,
        inline: true,
      });
    }

    // Type
    if (channel.type) {
      fields.push({
        name: interaction.getLocaleString("global.CHANNEL_TYPE"),
        value: localiseChannelType(interaction.getLocaleString, channel.type),
        inline: false,
      });
    }

    // Created
    if (guildChannel?.createdAt) {
      fields.push({
        name: interaction.getLocaleString("global.CREATED_ON"),
        value: createFullRelativeTimestamp(guildChannel.createdAt),
        inline: false,
      });
    }

    // Text-only values
    if (guildChannel?.isText()) {
      // Gets threads
      const activeThreads = await guildChannel.threads.fetchActive();
      const archivedThreads = await guildChannel.threads.fetchArchived();

      // Topic
      if (guildChannel.topic) {
        fields.push({
          name: interaction.getLocaleString("global.TOPIC"),
          value: guildChannel.topic.toString(),
          inline: false,
        });

        // Active threads amount
        if (activeThreads.threads.size > 0) {
          fields.push({
            name: interaction.getLocaleString("general.COMMAND_CHANNELINFO_ACTIVETHREADS"),
            value: activeThreads.threads.size.toString(),
            inline: true,
          });

          // Archived threads amount
          if (archivedThreads.threads.size > 0) {
            fields.push({
              name: interaction.getLocaleString("general.COMMAND_CHANNELINFO_ARCHIVEDTHREADS"),
              value: archivedThreads.threads.size.toString(),
              inline: true,
            });
          }
        }

        // NSFW
        if (guildChannel.nsfw === true) {
          fields.push({
            name: interaction.getLocaleString("global.NSFW"),
            value: interaction.getLocaleString("global.YES"),
            inline: true,
          });
        }
      }
    }

    await interaction.reply({
      embeds: [
        {
          fields: fields,
          color: this.bot.config.colours.primary,
          author: {
            name: channel.name,
            icon_url: interaction.guild?.iconURL({ dynamic: true }) || undefined,
          },
          footer: {
            text: interaction.getLocaleString("global.RAN_BY", { tag: interaction.user.tag }),
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          },
        },
      ],
    });
  }
}
