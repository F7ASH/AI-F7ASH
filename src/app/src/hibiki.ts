/**
 * @file Hibiki
 * @description Creates a new instance of Hibiki
 * @module hibiki
 */

import config from "../../../config/app.config";
import { HibikiClient } from "./classes/Client";

// Spawns a new instance of Hibiki
const bot = new HibikiClient(config);
bot.init();
