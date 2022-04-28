import { FC } from "react";
import { Author as AuthorData } from "../feed";

const Author: FC<{ author: AuthorData }> = ({ author }) => {
  const { name, url, avatar } = author;

  const hasName = name !== undefined;
  const hasUrl = url !== undefined;
  const hasAvatar = avatar !== undefined;

  if (hasAvatar) {
    if (hasUrl) {
      return (
        <a href={url} title={name}>
          <img className="avatar" src={avatar} referrerPolicy="no-referrer" />
        </a>
      );
    }

    return (
      <img
        className="avatar"
        src={avatar}
        title={name}
        referrerPolicy="no-referrer"
      />
    );
  }

  if (hasName) {
    if (hasUrl) {
      return <a href={url}>{name}</a>;
    }

    return <div>{name}</div>;
  }

  return <a href={url}>{url}</a>;
};

export default Author;
