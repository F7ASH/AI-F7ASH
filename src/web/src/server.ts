/**
 * @file Server
 * @description Controls authentication and the web backend
 * @module web/server
 */

import fastify from "fastify";

/**
 * Starts the Fastify webserver
 * @returns
 */

export async function init() {
  const app = fastify({
    disableRequestLogging: true,
  });

  // TODO:
  // - Use fastify logger
  // Impl. API shit
  // Production running together... hmmm

  app.get("/api/health", (req, res) => {
    res.send({ status: "ok" });
  });

  return app;
}
