import { FC } from "react";
import { FeedItem } from "../feed";
import Author from "./Author";

const Post: FC<{ feedItem: FeedItem }> = ({ feedItem }) => {
  const articleId = `post-${feedItem.id}`;

  return (
    <article id={articleId}>
      <div className="meta">
        <div className="authors">
          {feedItem.authors.map((author, index) => (
            <Author author={author} key={`author-${index}`} />
          ))}
        </div>
        <div className="content-wrapper">
          Magic content goes here.
        </div>
        <div className="actions">
          <button className="repost">Repost</button>
          <button className="react">React</button>
        </div>
      </div>
    </article>
  );
};

export default Post;
