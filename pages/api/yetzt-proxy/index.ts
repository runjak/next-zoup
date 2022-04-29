import { NextApiRequest, NextApiResponse } from "next";
import { fetchFeed, Feed } from "../../../feed";

type Data = Feed | { error: string };

// FIXME add missing CORS handling

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const sourceUrl = new URL(`https://yetzt.io/feed.json`);
  const maybeFeed = await fetchFeed(sourceUrl);

  if (maybeFeed !== null) {
    res.status(200).json(maybeFeed);
  }

  res.status(500).json({ error: `could not fetch '${sourceUrl.href}'.` });
}
