import { Item } from "rss-parser";
import { Conf, CountFilterRule, FreshFilterRule } from "./configure";
import logger from "./logger";
import { PaseRes } from "./parser";


/**
 * 
 */
const NOW = Date.now();
function freshFilter(rule: FreshFilterRule, item: Item) {
  const pubDate = item.pubDate;
  const isoDate = item.isoDate;

  try {
    const date = new Date(isoDate || pubDate);
    return (NOW - date.getTime()) < rule.fresh;
  } catch (e) {
    logger.error(`freshFilter error date=${pubDate || isoDate} ${item.link} ${e?.message || e}`);
    return true;
  }
}


/**
 * TODO
 */
function countFilter(rule: CountFilterRule, item: Item) {}


/**
 * 
 */
const filterMap = {
  fresh: freshFilter,
  count: countFilter,
};
function handleFilter(filterRules: Conf["filter"], items: Item[]) {
  return items.filter((item) => {
    if (filterRules.length) {
      return filterRules.every((rule) => {
        const filterHandle = filterMap[rule.type];
        // @ts-ignore
        return filterHandle(rule, item);
      });
    } else return true;
  });
}


/**
 * 
 */
export default (conf: Conf) => (data: PaseRes[]) => {
  const { filter } = conf;
  return data.map((x) => {
    const filteredItems = handleFilter(filter, x.parsed.items)
    return {
      ...x,
      filtered: {
        ...x.parsed,
        items: filteredItems
      }
    }
  });
};
