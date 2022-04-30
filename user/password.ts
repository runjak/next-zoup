import {
  DEFAULT_COST,
  hash as hashBcrypt,
  verify as verifyBcrypt,
  genSalt,
} from "@node-rs/bcrypt";
import { isObject, isString } from "lodash";

// See https://www.npmjs.com/package/@node-rs/bcrypt

export type HashAndSalt = {
  hash: string;
  salt: string;
};

export const isHashAndSalt = (
  maybeHashAndSalt: unknown
): maybeHashAndSalt is HashAndSalt => {
  if (isObject(maybeHashAndSalt)) {
    const { hash, salt } = maybeHashAndSalt as Record<string, unknown>;

    return isString(hash) && isString(salt);
  }

  return false;
};

export const passwordToHashAndSalt = async (
  password: string
): Promise<HashAndSalt> => {
  const salt = await genSalt(10, "2b");
  const hash = await hashBcrypt(`${password}${salt}`, DEFAULT_COST);

  return { hash, salt };
};

export const verify = (
  password: string,
  { hash, salt }: HashAndSalt
): Promise<boolean> => verifyBcrypt(`${password}${salt}`, hash);
