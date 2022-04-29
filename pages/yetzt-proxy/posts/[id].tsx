import { isArray, isString } from "lodash";
import { GetServerSideProps } from "next";
import { FC } from "react";
import Post from "../../../components/Post";
import { FeedItem, fetchFeedItem } from "../../../feed";

type Props = {
  feedItem: FeedItem;
};

const Page: FC<Props> = (props) => {
  return <Post feedItem={props.feedItem} />;
};

const base64ToPostUrl = (input: string): URL =>
  new URL(`${Buffer.from(input, "base64").toString("utf-8")}.json`);

const postIdToSourceUrl = (
  sourceId: string | Array<string> | undefined
): URL | null => {
  if (isString(sourceId)) {
    return base64ToPostUrl(sourceId);
  }

  if (isArray(sourceId)) {
    return base64ToPostUrl(sourceId[0]);
  }

  return null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const sourceUrl = postIdToSourceUrl(context.query["id"]);

  if (!sourceUrl) {
    return { notFound: true };
  }

  const maybeFeedItem = await fetchFeedItem(sourceUrl);

  if (maybeFeedItem === null) {
    return { notFound: true };
  }

  return { props: { feedItem: maybeFeedItem } };
};

export default Page;
