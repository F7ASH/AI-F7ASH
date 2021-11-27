import node from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess({
    typescript: {
      tsconfigFile: "./tsconfig.json",
    },
  }),

  kit: {
    adapter: node({
      out: "../../../dist",
    }),

    files: {
      assets: "./src/public",
      lib: "./src/lib",
      hooks: "./src/hooks/",
      routes: "./src/routes",
      serviceWorker: "./src/service-worker",
      template: "./src/templates/app.html",
    },

    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
  },
};

export default config;
