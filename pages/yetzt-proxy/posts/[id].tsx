import react, { FC } from "react";
import { GetServerSideProps } from "next";
import { fetchFeedItem, FeedItem, Author } from "../../../feed";
import Post from "../../../components/Post";

type Props = {
  feedItem: FeedItem;
};

const Page: FC<Props> = (props) => {
  return <Post feedItem={props.feedItem} />;
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

export default Page;
