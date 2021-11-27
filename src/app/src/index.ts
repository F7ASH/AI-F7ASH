/**
 * @file Index
 * @description Creates a new Hibiki sharding manager
 * @module index
 */

import config from "../../../config/app.config";
import { HibikiShardingManager } from "./classes/Sharder";
import path from "path";

const HIBIKI_INDEX_FILE = path.join(__dirname, `hibiki.${process.env.NODE_ENV === "development" ? "ts" : "js"}`);

// Creates and spawns the sharding manager
const manager = new HibikiShardingManager(HIBIKI_INDEX_FILE, config.hibiki.token, config.options.shardCount ?? "auto");
manager.spawn();
