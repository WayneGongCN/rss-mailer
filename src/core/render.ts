import { Conf } from "./configure";
import { PaseRes } from "./parser";
import * as ejs from "ejs";
import * as path from "path";
import { readFile } from "fs";
import logger from "./logger";


/**
 *
 */
let tpl = null as null | string;
function loadTemplate(conf: Conf): Promise<string> {
  const { template: tplFilePath } = conf;

  return new Promise((resolve, reject) => {
    if (tpl) return resolve(tpl);

    const resolvePath = path.resolve(tplFilePath);
    logger.info(`load template ${resolvePath}`);
    readFile(resolvePath, (error, data) => {
      if (error) {
        logger.error(`load template error ${error?.message || error}`);
        return reject(error);
      }
      logger.info(`load template success`);
      resolve((tpl = data.toString()));
    });
  });
}

/**
 *
 */
export default (conf: Conf) =>
  (parsedFeeds: PaseRes[]): Promise<string> => {
    return loadTemplate(conf)
      .then((tpl) => {
        logger.info("start render");
        const rendered = ejs.render(tpl, { data: parsedFeeds, conf });
        logger.info("render success");
        return rendered;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
