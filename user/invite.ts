import { readFile, writeFile } from "fs/promises";
import { every, isArray, isObject, isString } from "lodash";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import { dataDirectory, initialInviteKey } from "../config";

/**
 * Invite key handling for registration workflow.
 * The idea is that existing users can create invite keys.
 *
 * A valid invite key can be used once to register a new user.
 * If configured the key specified via the INITIAL_INVITE_KEY env can be used to create users, too.
 *
 * Upon creation and use invite tokens need to be written to disk.
 * Upon startup initial invite tokens need to be read from disk.
 */

type InviteStore = {
  keys: Array<string>;
};

const isInviteStore = (
  maybeInviteStore: unknown
): maybeInviteStore is InviteStore => {
  if (isObject(maybeInviteStore)) {
    const { keys } = maybeInviteStore as Record<string, unknown>;

    if (isArray(keys)) {
      return every(keys, isString);
    }
  }

  return false;
};

const inviteFile = path.join(dataDirectory, "invite.json");

const initInvites = async (): Promise<InviteStore> => {
  try {
    const data = await readFile(inviteFile);
    const maybeInviteStore = JSON.parse(String(data));

    if (isInviteStore(maybeInviteStore)) {
      return maybeInviteStore;
    }
  } catch {}

  return { keys: [] };
};

const writeInvites = (store: InviteStore): Promise<InviteStore> =>
  writeFile(inviteFile, JSON.stringify(store, null, 2)).then(() => store);

let asyncInvites: Promise<InviteStore> = initInvites();

export const getInviteKey = async (): Promise<string> => {
  const key = uuidV4();

  const oldAsyncInvites = asyncInvites;
  asyncInvites = oldAsyncInvites.then((invites) => {
    const nextInvites = {
      keys: [...invites.keys, key],
    };

    return writeInvites(nextInvites);
  });

  return key;
};

export const useInviteKey = async (key: string): Promise<boolean> => {
  if (initialInviteKey.length > 0 && initialInviteKey === key) {
    return true;
  }

  const oldAsyncInvites = asyncInvites;
  asyncInvites = oldAsyncInvites.then((invites) => {
    const nextInvites = {
      keys: invites.keys.filter((k) => k !== key),
    };

    return writeInvites(nextInvites);
  });

  return oldAsyncInvites.then((invites) => invites.keys.includes(key));
};
