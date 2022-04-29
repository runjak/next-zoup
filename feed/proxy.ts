import { Feed, FeedItem } from ".";
import { baseUrl } from "../config";

const rewriteFeedItemUrl = (input: string): string => {
  const proxyId = Buffer.from(input, "utf-8").toString("base64");
  const url = new URL(`${baseUrl}/yetzt-proxy/posts/${proxyId}`);
  return url.href;
};

export const rewriteFeedItem = (feedItem: FeedItem): FeedItem => {
  const { url, ...rest } = feedItem;

  return {
    ...rest,
    url: rewriteFeedItemUrl(url),
  };
};

const rewriteFeedUrl = (input: string): string => {
  let url = new URL(`${baseUrl}/api/feed-proxy`);
  url.searchParams.append(
    "url",
    Buffer.from(input, "utf-8").toString("base64")
  );
  return url.href;
};

export const rewriteFeed = (feed: Feed): Feed => {
  const { feed_url, next_url, items, ...rest } = feed;

  return {
    ...rest,
    feed_url: rewriteFeedUrl(feed_url),
    next_url: next_url ? rewriteFeedUrl(next_url) : undefined,
    items: items.map(rewriteFeedItem),
  };
};
