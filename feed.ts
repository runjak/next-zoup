/**
 * Definitions of feed related data as described in [spec.md](https://github.com/zoupio/spec/blob/main/spec.md).
 */

import { every, isArray, isObject, isString } from "lodash";

// FIXME subject to discussion in https://github.com/zoupio/spec/issues/3
export type Author<url> = {
  name?: string;
  url?: url;
  avatar?: url;
};

export type RawAuthor = Author<string>;
export type ParsedAuthor = Author<URL>;

export const isRawAuthor = (maybeAuthor: unknown): maybeAuthor is RawAuthor => {
  if (isObject(maybeAuthor)) {
    const { name, url, avatar } = maybeAuthor as Record<string, unknown>;

    return (
      (isString(name) || name === undefined) &&
      (isString(url) || url === undefined) &&
      (isString(avatar) || avatar === undefined)
    );
  }

  return false;
};

export const parseAuthor = ({
  name,
  url,
  avatar,
}: RawAuthor): ParsedAuthor => ({
  name,
  url: url ? new URL(url) : undefined,
  avatar: avatar ? new URL(avatar) : undefined,
});

export type Zoup<url> = {
  from?: Author<url>;
  via?: Author<url>;
  reposts?: Array<Author<url>>;
  reaction?: Author<url>;
  reactions?: Array<Author<url>>;
};

export type RawZoup = Zoup<string>;
export type ParsedZoup = Zoup<URL>;

export const isRawZoup = (maybeZoup: unknown): maybeZoup is RawZoup => {
  if (isObject(maybeZoup)) {
    const { from, via, reposts, reaction, reactions } = maybeZoup as Record<
      string,
      unknown
    >;

    const okFrom = from === undefined || isRawAuthor(from);
    const okVia = via === undefined || isRawAuthor(via);
    const okReposts =
      reposts === undefined ||
      (isArray(reposts) && every(reposts, isRawAuthor));
    const okReaction = reaction === undefined || isRawAuthor(reaction);
    const okReactions =
      reactions === undefined ||
      (isArray(reactions) && every(reactions, isRawAuthor));

    return okFrom && okVia && okReposts && okReaction && okReactions;
  }

  return false;
};

export const parseZoup = (rawZoup: RawZoup): ParsedZoup => {
  const { from, via, reposts, reaction, reactions } = rawZoup;

  return {
    from: from ? parseAuthor(from) : undefined,
    via: via ? parseAuthor(via) : undefined,
    reposts: reposts ? reposts.map(parseAuthor) : undefined,
    reaction: reaction ? parseAuthor(reaction) : undefined,
    reactions: reactions ? reactions.map(parseAuthor) : undefined,
  };
};

export type FeedItem<url, date> = {
  id: string;
  date_published: date;
  date_modified: date;
  url: url;
  content_html: string;
  content_text?: string;
  tags: Array<string>;
  title?: string;
  _zoup: Zoup<url>;
};

export type RawFeedItem = FeedItem<string, string>;
export type ParsedFeedItem = FeedItem<URL, Date>;

export const isRawFeedItem = (
  maybeFeedItem: unknown
): maybeFeedItem is RawFeedItem => {
  if (isObject(maybeFeedItem)) {
    const {
      id,
      date_published,
      date_modified,
      url,
      content_html,
      content_text,
      tags,
      title,
      _zoup,
    } = maybeFeedItem as Record<string, unknown>;

    const okId = isString(id);
    const okDatePublished = isString(date_published);
    const okDateModified = isString(date_modified);
    const okUrl = isString(url);
    const okContent_html = isString(content_html);
    const okContent_text = content_text === undefined || isString(content_text);
    const okTags = isArray(tags) && every(tags, isString);
    const okTitle = title === undefined || isString(title);
    const okZoup = isRawZoup(_zoup);

    return (
      okId &&
      okDatePublished &&
      okDateModified &&
      okUrl &&
      okContent_html &&
      okContent_text &&
      okTags &&
      okTitle &&
      okZoup
    );
  }

  return false;
};

export const parseFeedItem = (rawFeedItem: RawFeedItem): ParsedFeedItem => {
  const {
    id,
    date_published,
    date_modified,
    url,
    content_html,
    content_text,
    tags,
    title,
    _zoup,
  } = rawFeedItem;

  return {
    id,
    // FIXME is the date parsing here correct?
    // According to https://www.jsonfeed.org/version/1.1/ the string should follow https://tools.ietf.org/html/rfc3339
    date_published: new Date(date_published),
    date_modified: new Date(date_modified),
    url: new URL(url),
    content_html,
    content_text,
    tags,
    title,
    _zoup: parseZoup(_zoup),
  };
};

export type Feed<url, date> = {
  version: "https://jsonfeed.org/version/1.1";
  title: string;
  description: string;
  home_page_url: url;
  feed_url: url;
  /**
   * FIXME
   * https://www.jsonfeed.org/version/1.1/ states that the next_url shall be optional,
   * but https://github.com/zoupio/spec/blob/main/spec.md#feed appears to assert that it must be given.
   * If it is possible for a feed to have no more entries it would make sense to not have a next_url.
   * https://github.com/zoupio/spec/issues/4
   */
  next_url?: url;
  icon: url;
  favicon: url;
  authors: Array<Author<url>>;
  items: Array<FeedItem<url, date>>;
};

export type RawFeed = Feed<string, string>;
export type ParsedFeed = Feed<URL, Date>;

export const isRawFeed = (maybeFeed: unknown): maybeFeed is RawFeed => {
  if (isObject(maybeFeed)) {
    const {
      version,
      title,
      description,
      home_page_url,
      feed_url,
      next_url,
      icon,
      favicon,
      authors,
      items,
    } = maybeFeed as Record<string, unknown>;

    const okVersion = (version === "https://jsonfeed.org/version/1.1");
    const okTitle = isString(title);
    const okDescription = isString(description);
    const okHomePageUrl = isString(home_page_url);
    const okFeedUrl = isString(feed_url);
    const okNextUrl = (next_url === undefined || isString(next_url));
    const okIcon = isString(icon);
    const okFavicon = isString(favicon);
    const okAuthors = (isArray(authors) && every(authors, isRawAuthor));
    const okItems = (isArray(items) && every(items, isRawFeedItem));

    return okVersion
      && okTitle
      && okDescription
      && okHomePageUrl
      && okFeedUrl
      && okNextUrl
      && okIcon
      && okFavicon
      && okAuthors
      && okItems;
  }

  return false;
};

export const parseFeed = (rawFeed: RawFeed): ParsedFeed => {
  const {
    version,
    title,
    description,
    home_page_url,
    feed_url,
    next_url,
    icon,
    favicon,
    authors,
    items,
  } = rawFeed;

  return {
    version,
    title,
    description,
    home_page_url: new URL(home_page_url),
    feed_url: new URL(feed_url),
    next_url: next_url ? new URL(next_url) : undefined,
    icon: new URL(icon),
    favicon: new URL(favicon),
    authors: authors.map(parseAuthor),
    items: items.map(parseFeedItem),
  }
};
