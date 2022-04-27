/**
 * Definitions of feed related data as described in [spec.md](https://github.com/zoupio/spec/blob/main/spec.md).
 */

// FIXME subject to discussion in https://github.com/zoupio/spec/issues/3
export type Author = { name: string } | { url: URL } | { avatar: URL };

export const jsonParseAuthor = (input: string): Author => {
  const protoAuthor = JSON.parse(input);
  const { url: maybeUrl, avatar: maybeAvatar, name } = protoAuthor;

  return {
    name,
    url: maybeUrl ? new URL(maybeUrl) : undefined,
    avatar: maybeAvatar ? new URL(maybeAvatar) : undefined,
  };
};

export type FeedItem = {
  id: string;
  url: URL;
  content_html: string;
  content_text?: string;
  tags: Array<string>;
  title?: string;
};

type RawFeedItem = { url: string } & Omit<FeedItem, "url">;

const sanitizeFeedItem = (rawFeedItem: RawFeedItem): FeedItem => ({
  ...rawFeedItem,
  url: new URL(rawFeedItem.url),
});

export const jsonParseFeedItem = (input: string): FeedItem =>
  sanitizeFeedItem(JSON.parse(input));

export type Feed = {
  version: "https://jsonfeed.org/version/1.1";
  title: string;
  description: string;
  home_page_url: URL;
  feed_url: URL;
  next_url: URL;
  icon: URL;
  favicon: URL;
  authors: Array<Author>;
  items: Array<FeedItem>;
};

type RawFeed = {
  home_page_url: string;
  feed_url: string;
  next_url: string;
  icon: string;
  favicon: string;
  items: Array<RawFeedItem>;
} & Omit<
  Feed,
  "home_page_url" | "feed_url" | "next_url" | "icon" | "favicon" | "items"
>;

const sanitizeFeed = (rawFeed: RawFeed): Feed => ({
  ...rawFeed,
  home_page_url: new URL(rawFeed.home_page_url),
  feed_url: new URL(rawFeed.feed_url),
  next_url: new URL(rawFeed.next_url),
  icon: new URL(rawFeed.icon),
  favicon: new URL(rawFeed.favicon),
  items: rawFeed.items.map(sanitizeFeedItem),
});

export const jsonParseFeed = (input: string): Feed =>
  sanitizeFeed(JSON.parse(input));
