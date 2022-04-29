import react, { FC, useCallback, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import { fetchFeed, Feed, FeedItem } from "../../feed";
import Post from "../../components/Post";
import useFetch from "../../hooks/useFetch";

type Props = {
  feed: Feed;
};

const Posts: FC<{ items: Array<FeedItem> }> = ({ items }) => (
  <>
    {items.map((feedItem, index) => (
      <Post feedItem={feedItem} key={`feed-${index}`} />
    ))}
  </>
);

const Page: FC<Props> = ({ feed }) => {
  const nextUrl = feed.next_url;
  const fetchFunction = useCallback(
    async () => (nextUrl ? fetchFeed(new URL(nextUrl)) : null),
    [nextUrl]
  );
  const { status, result, doFetch } = useFetch(fetchFunction);

  return (
    <>
      <Posts items={feed.items} />
      {result !== null ? (
        <Page feed={result} />
      ) : (
        <button disabled={status === "fetching"} onClick={doFetch}>
          More
        </button>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceUrl = new URL(`https://yetzt.io/feed.json`);
  const maybeFeed = await fetchFeed(sourceUrl);

  if (maybeFeed === null) {
    return { notFound: true };
  }

  return { props: { feed: maybeFeed } };
};

export default Page;
