import { PathLike } from "fs";
import { readFile, writeFile } from "fs/promises";
import { isObject, isString } from "lodash";
import path from "path";
import { userDirectory } from "../config";
import { Author, isAuthor } from "../feed";
import { HashAndSalt, isHashAndSalt } from "./password";

export type User = {
  author: { name: string } & Author; // Author associated with each user
  hashAndSalt: HashAndSalt;
};

export const isUser = (maybeUser: unknown): maybeUser is User => {
  if (isObject(maybeUser)) {
    const { author, hashAndSalt } = maybeUser as Record<string, unknown>;

    const okAuthor = isAuthor(author);
    const okName = okAuthor ? isString(author.name) : false;
    const okHashAndSalt = isHashAndSalt(hashAndSalt);

    return okAuthor && okName && okHashAndSalt;
  }

  return false;
};

const pathFromUserName = (name: string): PathLike =>
  path.join(userDirectory, `${name}.json`);

const pathFromUser = (user: User) => pathFromUserName(user.author.name);

export const writeUser = (user: User) =>
  writeFile(pathFromUser(user), JSON.stringify(user, null, 2));

export const readUser = async (name: string): Promise<User | null> => {
  try {
    const data = await readFile(pathFromUserName(name));
    const maybeUser = JSON.parse(String(data));
    if (isUser(maybeUser)) {
      return maybeUser;
    }
  } catch {}

  return null;
};
