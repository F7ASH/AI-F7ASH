module.exports = {
  extends: ["../../.eslintrc"],
  plugins: ["svelte3"],
  ignorePatterns: ["global.d.ts"],

  // Enables Svelte parsing
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],

  // Svelte TypeScript support
  settings: {
    "svelte3/typescript": () => require("typescript"),
  },

  rules: {
    // Svelte uses default exports
    "import/no-default-export": 0,
  },
};
