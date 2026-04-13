const app = require("./app");
const env = require("./config/env");

const server = app.listen(env.PORT, () => {
  console.log(`QuackUp API listening on port ${env.PORT}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
