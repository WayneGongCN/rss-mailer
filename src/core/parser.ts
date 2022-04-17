import { Conf } from "./configure";
import { FetcherRes } from "./fetcher";
// @ts-ignore
import Parser, { Output } from "rss-parser";
import logger from "./logger";


export type PaseRes = FetcherRes & {
  parsed: Output<any>;
};


const parser: Parser<{}, {}> = new Parser();


function parse(data: FetcherRes): Promise<PaseRes> {
  logger.info(`parse ${data.feed.url}`)
  return parser
    .parseString(data.original)
    .then((parsed: Output<any>) => {
      logger.info(`parse success ${data.feed.url}`)
      return { ...data, parsed };
    })
    .catch((error: any) => {
      logger.error(`parse error ${data.feed.url} `, error?.message || error);
      return Promise.reject({ ...data, error });
    });
}


export default (conf: Conf) => (fetcherRes: FetcherRes[]) => {
  return Promise.allSettled(fetcherRes.map(parse));
};
