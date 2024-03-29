import {
  DEFAULT_COST,
  hash as hashBcrypt,
  verify as verifyBcrypt,
} from "@node-rs/bcrypt";
import { PathLike } from "fs";
import { readFile, writeFile, unlink } from "fs/promises";
import { isObject, isString } from "lodash";
import path from "path";
import { userDirectory } from "../config";
import { isAuthor, NamedAuthor } from "../feed";

export type User = {
  author: NamedAuthor; // Author associated with each user
  hash: string;
};

export const isUser = (maybeUser: unknown): maybeUser is User => {
  if (isObject(maybeUser)) {
    const { author, hash } = maybeUser as Record<string, unknown>;

    const okAuthor = isAuthor(author);
    const okName = okAuthor ? isString(author.name) : false;
    const okHashAndSalt = isString(hash);

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

export const deleteUser = async (user: User) => unlink(pathFromUser(user));

export const hashPassword = (password: string): Promise<string> =>
  hashBcrypt(password, DEFAULT_COST);

export const verify = (password: string, user: User): Promise<boolean> =>
  verifyBcrypt(password, user.hash);
