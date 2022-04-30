import { CSSProperties, FC } from "react";
import { Author as AuthorData } from "../feed";

const avatarStyle: CSSProperties = {
  width: '48px',
  height: '48px'
};

const Author: FC<{ author: AuthorData }> = ({ author }) => {
  const { name, url, avatar } = author;

  const hasName = name !== undefined;
  const hasUrl = url !== undefined;
  const hasAvatar = avatar !== undefined;

  if (hasAvatar) {
    if (hasUrl) {
      return (
        <a href={url} title={name}>
          {/* eslint-disable-next-line jsx-a11y/alt-text,@next/next/no-img-element */}
          <img style={avatarStyle} src={avatar} referrerPolicy="no-referrer" />
        </a>
      );
    }

    return (
      // eslint-disable-next-line jsx-a11y/alt-text,@next/next/no-img-element
      <img
        style={avatarStyle}
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
