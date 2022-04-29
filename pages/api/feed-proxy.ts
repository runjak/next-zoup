import { isArray, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { baseUrl } from "../../config";
import { Feed, fetchFeed } from "../../feed";

type Data = Feed | { error: string };

const base64ToURL = (input: string): URL | null => {
  try {
    const href = Buffer.from(input, "base64").toString("utf-8");
    return new URL(href);
  } catch {
    return null;
  }
};

const urlParameter = (request: NextApiRequest): URL | null => {
  const parameter = request.query["url"];

  if (isString(parameter)) {
    return base64ToURL(parameter);
  }

  if (isArray(parameter)) {
    return base64ToURL(parameter[0]);
  }

  return null;
};

const rewriteFeedUrl = (input: string): string => {
  let url = new URL(`${baseUrl}/api/feed-proxy`);
  url.searchParams.append(
    "url",
    Buffer.from(input, "utf-8").toString("base64")
  );
  return url.href;
};

const rewriteFeed = (feed: Feed): Feed => {
  const { feed_url, next_url, ...rest } = feed;

  return {
    ...rest,
    feed_url: rewriteFeedUrl(feed_url),
    next_url: next_url ? rewriteFeedUrl(next_url) : undefined,
  };
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  const url = urlParameter(request);

  if (!url) {
    return response
      .status(400)
      .json({ error: 'could not parse query parameter "url".' });
  }

  const maybeFeed = await fetchFeed(url);

  if (!maybeFeed) {
    return response
      .status(500)
      .json({ error: `could not fetch feed from "${url.href}".` });
  }

  return response.status(200).json(rewriteFeed(maybeFeed));
}
