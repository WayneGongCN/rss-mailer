import { Conf, Feed } from "./configure";
import axios from "axios";
import * as iconv from "iconv-lite";
import logger from "./logger";


export interface FetcherRes {
  feed: Feed;
  original: string;
}


const decodeHandleMap = {
  utf8: (buffer: Buffer) => buffer.toString("utf8"),
  gbk: (buffer: Buffer) => iconv.decode(buffer, "gbk"),
};


/**
 * 
 * @param feed 
 * @returns 
 */
function request(feed: Feed) {
  logger.info(`fetch ${feed.url}`);
  return axios
    .get(feed.url, { responseType: "arraybuffer", timeout: feed.timeout })
    .then((res) => {
      logger.info(`fetch success ${feed.url}`);
      return res;
    })
    .then((res) => decodeHandleMap[feed.charset](res.data))
    .then((original) => ({ feed, original }))
    .catch((error) => {
      logger.error(`fetch error ${feed.url}`, error?.message || error);
      return Promise.reject({ feed, error });
    });
}


export default (conf: Conf) => {
  const { feeds } = conf;
  const promises = feeds.map(request);
  return Promise.allSettled(promises);
};
