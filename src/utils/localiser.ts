/**
 * @file Localiser
 * @description Localises and formats values
 * @module localiser
 */

import type { GetLocaleString } from "../typings/locales";
import type { ChannelType } from "discord-api-types";
import type { ThreadChannelTypes } from "discord.js";

/**
 * Hardcoded Discord.js channel types
 * @todo Not do this. This WILL break in a future API change!
 */

type GuildChannelTypes =
  | "GUILD_TEXT"
  | "GUILD_VOICE"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE"
  | "GUILD_STAGE_VOICE"
  | ThreadChannelTypes
  | ChannelType;

/**
 * Localises a channel type
 * @param fn The function to get a string with
 * @param type The type of channel to localise
 * @returns A localised channel type
 */

export function localiseChannelType(fn: GetLocaleString, type: GuildChannelTypes) {
  switch (type) {
    case "GUILD_CATEGORY": {
      return fn("global.CATEGORY");
    }

    case "GUILD_NEWS": {
      return fn("global.NEWS");
    }

    case "GUILD_STAGE_VOICE": {
      return fn("global.STAGE");
    }

    case "GUILD_STORE": {
      return fn("global.STORE");
    }

    case "GUILD_TEXT": {
      return fn("global.TEXT");
    }

    case "GUILD_VOICE": {
      return fn("global.VOICE");
    }

    case undefined:
    default:
      return type.toString();
  }
}
