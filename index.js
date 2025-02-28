const app = require("./app")
const logger = require("./utils/logger")
const config = require("./utils/config")
const path = require("path")
global.appRoot = path.resolve(__dirname)

app.listen(config.PORT, () => {
  logger.info(`Connecting to server at port ${config.PORT}`);
})