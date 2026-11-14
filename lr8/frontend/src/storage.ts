import { LoginMethod } from "./types";
import type {
  Account,
  BrowserState,
  SecurityData,
  Session,
  StoredAccount,
} from "./types";
import * as Utils from "./utils";

export const validity = {
  registration: 15 * 60_000,
  reset: 60 * 60_000,
  session: 24 * 60 * 60_000,
  remembered: 30 * 24 * 60 * 60_000,
};

export const googleAccount = {
  subject: "mock-google-user",
  profile: {
    firstName: "Мария",
    lastName: "Пример",
    phone: "",
    email: "google@example.test",
  },
};

// Keep the existing keys so this cleanup preserves saved accounts and sessions.
const keys = {
  data: "lr8:mock:database:v1",
  session: "lr8:mock:session:v1",
  remembered: "lr8:mock:remembered:v1",
};

function read<T>(storage: Storage, key: string): T | undefined {
  try {
    return JSON.parse(storage.getItem(key) ?? "null") ?? undefined;
  } catch {
    return undefined;
  }
}

export async function loadStore(): Promise<BrowserState> {
  let data = read<BrowserState["data"]>(localStorage, keys.data);
  if (!data) {
    data = {
      accounts: [
        {
          id: "demo-account",
          username: "user",
          firstName: "user",
          lastName: "user",
          phone: "123456789",
          email: "user@user.demo",
          passwordHash: await Utils.digestPassword("user"),
        },
      ],
    };
    saveData(data);
  }
  const session =
    read<Session>(localStorage, keys.remembered) ??
    read<Session>(sessionStorage, keys.session) ??
    {};
  return {
    data,
    session:
      session.expiresAt && session.expiresAt <= Date.now() ? {} : session,
  };
}

export function saveData(data: BrowserState["data"]) {
  localStorage.setItem(keys.data, JSON.stringify(data));
}

export function saveSession(session: Session) {
  localStorage.removeItem(keys.remembered);
  sessionStorage.removeItem(keys.session);
  const storage = session.remember ? localStorage : sessionStorage;
  storage.setItem(
    session.remember ? keys.remembered : keys.session,
    JSON.stringify(session),
  );
}

export function currentUser(state: BrowserState) {
  return state.data.accounts.find((user) => user.id === state.session.userId);
}

export function requireUser(state: BrowserState) {
  const user = currentUser(state);
  if (!user) {
    location.replace("/");
    throw new Error("Войдите в аккаунт.");
  }
  return user;
}

export function signIn(userId: string, remember = false) {
  saveSession({
    userId,
    remember,
    expiresAt: Date.now() + (remember ? validity.remembered : validity.session),
  });
}

export function publicProfile(user: StoredAccount): Account {
  const { id, username, firstName, lastName, phone, email } = user;
  return { id, username, firstName, lastName, phone, email };
}

export function securityData(state: BrowserState): SecurityData {
  const user = requireUser(state);
  const loginMethods: SecurityData["loginMethods"] = [];
  if (user.passwordHash) loginMethods.push(LoginMethod.Password);
  if (state.data.passkeyUserId === user.id)
    loginMethods.push(LoginMethod.Passkey);
  if (user.googleSubject) loginMethods.push(LoginMethod.Google);
  return { loginMethods };
}
