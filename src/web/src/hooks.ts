/**
 * @file Hooks
 * @description Things to hook into sveltekit with
 * @module web/hooks
 */

import * as server from "./server";

export async function handle({ request, resolve }: any) {
  // Routes all requests to Fastify if it starts with /api/

  if (request.path.startsWith("/api")) {
    // Starts the server
    const fastifyServer = await server.init();

    // Injects into sveltekit
    const response = await fastifyServer.inject({
      method: "GET",
      url: request.path,
      query: request.query,
      payload: request.payload,
      headers: request.headers,
    });

    // Return Fastify's response with an object SvelteKit can understand
    return {
      status: response.statusCode,
      body: response.body,
    };
  }

  const response = await resolve(request);

  return {
    ...response,
    headers: {
      ...response.headers,
    },
  };
}
