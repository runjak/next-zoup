import { GetServerSideProps } from "next";
import { FC, useCallback } from "react";
import Layout from "../../components/Layout";
import Post from "../../components/Post";
import { Feed, fetchFeed } from "../../feed";
import useFetch from "../../hooks/useFetch";

type Props = {
  feed: Feed;
};

const Posts: FC<Props> = ({ feed }) => {
  const nextUrl = feed.next_url;
  const fetchFunction = useCallback(
    async () => (nextUrl ? fetchFeed(new URL(nextUrl)) : null),
    [nextUrl]
  );
  const { status, result, doFetch } = useFetch(fetchFunction);

  return (
    <>
      {feed.items.map((feedItem) => (
        <Post feedItem={feedItem} key={`post-${feedItem.id}`} />
      ))}
      {result !== null ? (
        <Posts feed={result} />
      ) : (
        <button disabled={status === "fetching"} onClick={doFetch}>
          More
        </button>
      )}
    </>
  );
};

const Page: FC<Props> = (props) => {
  return (
    <Layout headline="Some cool headline">
      <Posts {...props} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceUrl = new URL(
    `http://localhost:3000/api/feed-proxy?url=aHR0cHM6Ly95ZXR6dC5pby9mZWVkLmpzb24=`
  );
  const maybeFeed = await fetchFeed(sourceUrl);

  if (maybeFeed === null) {
    return { notFound: true };
  }

  return { props: { feed: maybeFeed } };
};

export default Page;
