import { NextApiRequest, NextApiResponse } from "next";
import { fetchFeedItem, FeedItem } from "../../../../feed";

type Data = FeedItem | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const sourceId = req.query["id"];
  const sourceUrl = new URL(`https://yetzt.io/post/${sourceId}.json`);

  const maybeFeedItem = await fetchFeedItem(sourceUrl);

  if (maybeFeedItem !== null) {
    res.status(200).json(maybeFeedItem);
  }

  res.status(500).json({ error: `could not fetch '${sourceUrl.href}'.` });
}
