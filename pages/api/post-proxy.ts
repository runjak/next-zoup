import { NextApiRequest, NextApiResponse } from "next";
import { FeedItem, fetchFeedItem } from "../../feed";
import { rewriteFeedItem } from "../../feed/proxy";
import { urlParameter } from "./feed-proxy";

type Data = FeedItem | { error: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  let url = urlParameter(request);

  if (!url) {
    return response
      .status(400)
      .json({ error: 'could not parse query parameter "url".' });
  }

  url.pathname = `${url.pathname}.json`

  const maybeFeedItem = await fetchFeedItem(url);

  if (!maybeFeedItem) {
    return response
      .status(500)
      .json({ error: `could not fetch post from "${url.href}"` });
  }

  return response.status(200).json(rewriteFeedItem(maybeFeedItem));
}
