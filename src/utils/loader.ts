/**
 * @file Loader
 * @description Loads and registers commands and events
 * @module loader
 */

import type { HibikiClient } from "../classes/Client";
import type { HibikiCommand } from "../classes/Command";
import type { HibikiEvent } from "../classes/Event";
import type { HibikiLogger } from "../classes/Logger";
import type { ApplicationCommandData, Collection } from "discord.js";
import type { PathLike } from "fs";
import { moduleFiletypeRegex } from "../utils/constants";
import { logger } from "./logger";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import path from "path";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Loads all commands
 * @param bot Main bot object
 * @param directory The directory to look for commands in
 */

export function loadCommands(bot: HibikiClient, directory: PathLike) {
  const files = fs.readdirSync(directory, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      return loadCommands(bot, path.join(directory.toString(), file.name));
    }

    let command;
    if (!moduleFiletypeRegex.test(file.name)) return;

    try {
      const importedCommand = require(`${directory}/${file.name}`);
      command = importedCommand[Object.keys(importedCommand)[0]];
    } catch (err) {
      console.error(err);
    }

    if (!command) return;
    const splitPath = directory.toString().split("/");
    const fileName = file.name.split(moduleFiletypeRegex)[0];

    const cmd = new command(bot, fileName, splitPath[splitPath.length - 1]) as HibikiCommand;
    bot.commands.set(fileName, cmd);
  });

  // Converts the command to Discord API-compatible JSON
  const jsonData = bot.commands.map((command) => commandToJSON(command));

  // Attempts to register all commands globally
  IS_DEVELOPMENT ? registerGuildCommands(bot, bot.config.hibiki.testGuildID, jsonData) : registerGlobalCommands(bot, jsonData);
}

/**
 * Loads all events and loggers
 * @param bot Main bot object
 * @param directory The path to search for events or loggers in
 * @param isLogger Whether or not the item is a logger or not
 */

export function loadEvents(bot: HibikiClient, directory: string, isLogger = false) {
  /**
   * Runs events and loggers
   * @param events The events to subscribe to
   */

  function subscribeToEvents(events: Collection<string, HibikiEvent | HibikiLogger>) {
    events.forEach((event) => {
      event.events.forEach((e) => {
        bot.on(e, (...eventParams) => event.run(e, ...eventParams));
      });
    });
  }

  // Loads each event file
  const files = fs.readdirSync(directory, { withFileTypes: true, encoding: "utf-8" });

  files.forEach((file) => {
    if (file.isDirectory()) return;

    let event;
    if (!moduleFiletypeRegex.test(file.name)) return;

    try {
      const importedEvent = require(`${directory}/${file.name}`);
      event = importedEvent[Object.keys(importedEvent)[0]];
    } catch (err) {
      logger.error(`${isLogger ? "Logger" : "Event"} ${file.name} failed to load: ${err}`);
      console.error(err);
    }

    if (!event) return;

    // Pushes the events and runs them
    const fileName = file.name.split(moduleFiletypeRegex)[0];
    (isLogger ? bot.loggers : bot.events).set(fileName, new event(bot, fileName));
  });

  subscribeToEvents(isLogger ? bot.loggers : bot.events);
}

/**
 * Registers commands via the Discord API
 * @param bot Main bot object
 * @param guild The guild ID to update commands in
 * @param commands An array of JSON command data to register
 */

export async function registerGuildCommands(bot: HibikiClient, guild: DiscordSnowflake, commands: ApplicationCommandData[]) {
  const rest = new REST({ version: "9" }).setToken(bot.config.hibiki.token);
  await rest.put(Routes.applicationGuildCommands(bot.user?.id as DiscordSnowflake, guild), { body: commands });
}

/**
 * Registers global slash commands via the Discord API
 * @param bot Main bot object
 * @param commands An array of JSON command data to register
 */

export async function registerGlobalCommands(bot: HibikiClient, commands: ApplicationCommandData[]) {
  const rest = new REST({ version: "9" }).setToken(bot.config.hibiki.token);
  await rest.put(Routes.applicationCommands(bot.user?.id as DiscordSnowflake), { body: commands });
}

/**
 * Converts a Hibiki command to Discord API-compatible JSON
 * @param command The command to register
 */

export function commandToJSON(command: HibikiCommand) {
  return {
    name: command.name,
    description: command.description,
    options: command.options,
  };
}