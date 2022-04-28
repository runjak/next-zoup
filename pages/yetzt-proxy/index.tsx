import react, { FC } from "react";
import { GetServerSideProps } from "next";
import { fetchFeed, Feed } from "../../feed";

type Props = {
  feedItem: Feed;
};

const Page: FC<Props> = (props) => {
  return <code>{JSON.stringify(props.feedItem, null, 2)}</code>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceUrl = new URL(`https://yetzt.io/feed.json`);
  const maybeFeedItem = await fetchFeed(sourceUrl);

  if (maybeFeedItem === null) {
    return { notFound: true };
  }

  return { props: { feedItem: maybeFeedItem } };
};

export default Page;
