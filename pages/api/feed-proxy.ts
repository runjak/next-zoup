import { isArray, isString } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Feed, fetchFeed } from "../../feed";
import { rewriteFeed } from "../../feed/proxy";

type Data = Feed | { error: string };

const base64ToURL = (input: string): URL | null => {
  try {
    const href = Buffer.from(input, "base64").toString("utf-8");
    return new URL(href);
  } catch {
    return null;
  }
};

export const urlParameter = (request: NextApiRequest): URL | null => {
  const parameter = request.query["url"];

  if (isString(parameter)) {
    return base64ToURL(parameter);
  }

  if (isArray(parameter)) {
    return base64ToURL(parameter[0]);
  }

  return null;
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
