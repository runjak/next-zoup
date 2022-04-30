import { ComponentProps, CSSProperties, FC } from "react";
import htmr from "htmr";

import { FeedItem } from "../feed";
import Author from "./Author";

const transform = {
  img: (
    props: ComponentProps<"img">
    // eslint-disable-next-line jsx-a11y/alt-text,@next/next/no-img-element
  ) => <img {...props} referrerPolicy="no-referrer" />,
};

const Post: FC<{ feedItem: FeedItem }> = ({ feedItem }) => {
  const articleId = `post-${feedItem.id}`;

  return (
    <article id={articleId}>
      <div className="meta">
        <div className="authors">
          <a href={feedItem.url} className="post-anchor">
            🔗
          </a>
          {feedItem.authors.map((author, index) => (
            <Author author={author} key={`author-${index}`} />
          ))}
        </div>
      </div>
      <div className="content-wrapper">
        {htmr(feedItem.content_html, { transform })}
      </div>
      <div className="action">
        <button className="repost" title="Repost">
          🔄 Repost
        </button>
        <button className="react" title="React">
          ↩️ React
        </button>
      </div>
    </article>
  );
};

export default Post;
