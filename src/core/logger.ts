import { getLogger, configure } from "log4js";
import { join } from "path";

const logger = getLogger();

const categories = {
  default: { appenders: ["stdout", "file"], level: "trace" },
};

const appenders = {
  stdout: { type: "stdout" },
  file: { type: "file", filename: join(process.cwd(), "rssmailer.log") },
};

configure({ categories, appenders });

export default logger;
