/**
 * Definitions of feed related data as described in [spec.md](https://github.com/zoupio/spec/blob/main/spec.md).
 */

import { every, isArray, isObject, isString } from "lodash";

// FIXME subject to discussion in https://github.com/zoupio/spec/issues/3
export type Author = {
  name?: string;
  url?: string;
  avatar?: string;
};

export const isAuthor = (maybeAuthor: unknown): maybeAuthor is Author => {
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

export type Zoup = {
  from?: Author;
  via?: Author;
  reposts?: Array<Author>;
  reaction?: Author;
  reactions?: Array<Author>;
};

export const isZoup = (maybeZoup: unknown): maybeZoup is Zoup => {
  if (isObject(maybeZoup)) {
    const { from, via, reposts, reaction, reactions } = maybeZoup as Record<
      string,
      unknown
    >;

    const okFrom = from === undefined || isAuthor(from);
    const okVia = via === undefined || isAuthor(via);
    const okReposts =
      reposts === undefined || (isArray(reposts) && every(reposts, isAuthor));
    const okReaction = reaction === undefined || isAuthor(reaction);
    const okReactions =
      reactions === undefined ||
      (isArray(reactions) && every(reactions, isAuthor));

    return okFrom && okVia && okReposts && okReaction && okReactions;
  }

  return false;
};

export type FeedItem = {
  id: string;
  // According to https://www.jsonfeed.org/version/1.1/
  // the date strings should follow https://tools.ietf.org/html/rfc3339
  date_published: string;
  date_modified: string;
  url: string;
  content_html: string;
  content_text?: string;
  tags: Array<string>;
  title?: string;
  _zoup: Zoup;
};

export const isFeedItem = (
  maybeFeedItem: unknown
): maybeFeedItem is FeedItem => {
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
    const okZoup = isZoup(_zoup);

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

export const fetchFeedItem = async (url: URL): Promise<FeedItem | null> => {
  try {
    const response = await fetch(url.href);
    const responseBody = await response.json();

    if (isFeedItem(responseBody)) {
      return responseBody;
    }
  } catch {}

  return null;
};

export type Feed = {
  version: "https://jsonfeed.org/version/1.1";
  title: string;
  description?: string;
  home_page_url: string;
  feed_url: string;
  /**
   * FIXME
   * https://www.jsonfeed.org/version/1.1/ states that the next_url shall be optional,
   * but https://github.com/zoupio/spec/blob/main/spec.md#feed appears to assert that it must be given.
   * If it is possible for a feed to have no more entries it would make sense to not have a next_url.
   * https://github.com/zoupio/spec/issues/4
   */
  next_url?: string;
  icon: string;
  favicon: string;
  authors: Array<Author>;
  items: Array<FeedItem>;
};

export const isFeed = (maybeFeed: unknown): maybeFeed is Feed => {
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

    const okVersion = version === "https://jsonfeed.org/version/1.1";
    const okTitle = isString(title);
    const okDescription = description === undefined || isString(description);
    const okHomePageUrl = isString(home_page_url);
    const okFeedUrl = isString(feed_url);
    const okNextUrl = next_url === undefined || isString(next_url);
    const okIcon = isString(icon);
    const okFavicon = isString(favicon);
    const okAuthors = isArray(authors) && every(authors, isAuthor);
    const okItems = isArray(items) && every(items, isFeedItem);

    return (
      okVersion &&
      okTitle &&
      okDescription &&
      okHomePageUrl &&
      okFeedUrl &&
      okNextUrl &&
      okIcon &&
      okFavicon &&
      okAuthors &&
      okItems
    );
  }

  return false;
};

export const fetchFeed = async (url: URL): Promise<Feed | null> => {
  try {
    const response = await fetch(url.href);
    const responseBody = await response.json();

    if (isFeed(responseBody)) {
      return responseBody;
    }
  } catch {}

  return null;
};
