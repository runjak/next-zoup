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
    {items.map((feedItem) => (
      <Post feedItem={feedItem} key={`post-${feedItem.id}`} />
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
  const sourceUrl = new URL(`http://localhost:3000/api/feed-proxy?url=aHR0cHM6Ly95ZXR6dC5pby9mZWVkLmpzb24=`);
  const maybeFeed = await fetchFeed(sourceUrl);

  if (maybeFeed === null) {
    return { notFound: true };
  }

  return { props: { feed: maybeFeed } };
};

export default Page;
