#!/usr/bin/env node
import { Command } from "commander";
import logger from "../core/logger";
import configure, { Conf, Feed } from "../core/configure";
import fetcher, { FetcherRes } from "../core/fetcher";
import parser, { PaseRes } from "../core/parser";
import render from "../core/render";
import sender from "../core/sender";
import filter from "../core/filter";

export interface Options {
  config: string;
}

/**
 * 
 */
function handler(options: Options) {
  const { config: confFilePath } = options || {};
  logger.info(`Start at \t ${new Date().toLocaleString()}`);
  logger.debug("options", options);

  const error: any = [];
  const conf = configure(confFilePath, options);

  fetcher(conf)
    .then((res) => {
      error.push(
        ...res
          .filter((x) => x.status === "rejected")
          .map((x: PromiseRejectedResult) => x.reason)
      );
      return res
        .filter((x) => x.status === "fulfilled")
        .map((x: PromiseFulfilledResult<FetcherRes>) => x.value);
    })

    .then(parser(conf))
    .then((res) => {
      error.push(
        ...res
          .filter((x) => x.status === "rejected")
          .map((x: PromiseRejectedResult) => x.reason)
      );
      return res
        .filter((x) => x.status === "fulfilled")
        .map((x: PromiseFulfilledResult<PaseRes>) => x.value);
    })

    .then(filter(conf))
    .then(render(conf))
    .then(sender(conf))
    .then(() => {
      logger.info("done");
      process.exit(0);
    })
    .catch((e: any) => {
      logger.error(`UNKNOWN ERROR`, e?.message || e || "");
      process.exit(-1);
    });
}


/**
 * 
 */
const packageJson = require("../../package.json");
new Command()
  .name("rssmailer")
  .version(packageJson.version, "-v --version", "Output RssMailer version")
  .requiredOption("-c, --config <path>", "RssMailer config file path")
  .action(handler)
  .parse(process.argv);
