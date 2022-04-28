import react, { FC } from "react";
import { GetServerSideProps } from "next";
import { fetchFeedItem, FeedItem } from "../../../feed";

type Props = {
  feedItem: FeedItem;
};

const Page: FC<Props> = (props) => {
  return <code>{JSON.stringify(props.feedItem, null, 2)}</code>;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceId = context.query["id"];
  const sourceUrl = new URL(`https://yetzt.io/post/${sourceId}.json`);
  const maybeFeedItem = await fetchFeedItem(sourceUrl);

  if (maybeFeedItem === null) {
    return { notFound: true };
  }

  return { props: { feedItem: maybeFeedItem } };
};

// Local testing with something like http://localhost:3000/yetzt-proxy/posts/b74vh0-ko

export default Page;
