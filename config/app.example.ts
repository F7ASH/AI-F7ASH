const HibikiConfig: HibikiConfig = {
  hibiki: {
    token: "",
    locale: "en-GB",
    testGuildID: "",
  },

  database: {
    database: "postgres",
    host: "127.0.0.1",
    provider: "json",
    schema: "hibiki",
    user: "postgres",
  },

  colours: {
    primary: "0x648FFF",
    secondary: "0xDC267F",
    error: "0xFE6100",
    success: "0x785EF0",
    warning: "0xFFB000",
  },

  options: {
    intents: [],
  },
};

// eslint-disable-next-line import/no-default-export
export default HibikiConfig;
