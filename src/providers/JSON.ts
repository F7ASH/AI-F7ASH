/**
 * @file JSON Provider
 * @description The Hibiki JSON database provider
 * @module JSONProvider
 */

import { HibikiProvider, HIBIKI_DATABASE_TABLES } from "../classes/Provider";
import { logger } from "../utils/logger";
import fs from "fs";
import path from "path";

const HIBIKI_DATABASE_FILE = path.join(__dirname, "../../hibiki.db.json");
type HibikiJSONDatabaseStructure = Record<HIBIKI_DATABASE_TABLE_NAMES, any>;

export class JSONProvider extends HibikiProvider {
  providerName: HibikiDatabaseProvider = "json";
  db = {} as HibikiJSONDatabaseStructure;

  public async getGuildConfig(guild: DiscordSnowflake) {
    return this.db.GUILD_CONFIGS[guild] as Promise<HibikiGuildConfig>;
  }

  public async updateGuildConfig(guild: DiscordSnowflake, config: HibikiUserConfig) {
    this.db.GUILD_CONFIGS[guild] = { ...this.db.GUILD_CONFIGS[guild], ...config };
    this._updateJSON();
  }

  public async replaceGuildConfig(guild: DiscordSnowflake, config: HibikiUserConfig) {
    this.db.GUILD_CONFIGS[guild] = config;
    this._updateJSON();
  }

  public async deleteGuildConfig(guild: DiscordSnowflake) {
    delete this.db.GUILD_CONFIGS[guild];
    this._updateJSON();
  }

  public async insertBlankGuildConfig(guild: DiscordSnowflake) {
    this.db.GUILD_CONFIGS[guild] = { id: guild };
    this._updateJSON();
  }

  public async getUserConfig(user: DiscordSnowflake) {
    return this.db.USER_CONFIGS[user];
  }

  public async updateUserConfig(user: DiscordSnowflake, config: HibikiUserConfig) {
    this.db.USER_CONFIGS[user] = { ...this.db.USER_CONFIGS[user], ...config };
    this._updateJSON();
  }

  public async replaceUserConfig(user: DiscordSnowflake, config: HibikiUserConfig) {
    this.db.USER_CONFIGS[user] = config;
    this._updateJSON();
  }

  public async deleteUserConfig(user: DiscordSnowflake) {
    delete this.db.USER_CONFIGS[user];
    this._updateJSON();
  }

  public async insertBlankUserConfig(user: DiscordSnowflake) {
    this.db.USER_CONFIGS[user] = { id: user };
    this._updateJSON();
  }

  /**
   * Initializes the database
   */

  public async init() {
    // Creates a new file if it doesn't exist
    if (!fs.existsSync(HIBIKI_DATABASE_FILE)) {
      try {
        // Writes an empty file
        fs.writeFileSync(HIBIKI_DATABASE_FILE, "{}");
      } catch (err) {
        logger.error(`Failed to write the initial output file: ${err}`);
        throw new Error(err as string);
      }
    }

    // Ensures the config isn't empty
    const HIBIKI_DATABASE_FILE_CONTENTS = fs.readFileSync(HIBIKI_DATABASE_FILE, { encoding: "utf-8" })?.toString();
    if (!HIBIKI_DATABASE_FILE_CONTENTS?.length) fs.writeFileSync(HIBIKI_DATABASE_FILE, "{}");

    this.db = JSON.parse(HIBIKI_DATABASE_FILE_CONTENTS);
    HIBIKI_DATABASE_TABLES.forEach((name) => {
      if (!this.db[name]) {
        this.db[name] = {};
        logger.info(`Created the ${name} table in the database`);
        this._updateJSON();
      }
    });
  }

  private async _updateJSON() {
    fs.writeFileSync(HIBIKI_DATABASE_FILE, JSON.stringify(this.db), { encoding: "utf-8" });
  }
}
