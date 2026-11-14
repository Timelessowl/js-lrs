import type { Account, ProfileData } from "./types";

export const limits = {
  usernameMin: 3, usernameMax: 30, nameMax: 100, phoneMax: 32, emailMax: 254, loginMax: 254,
  passwordMin: 8, passwordMax: 128, confirmationCodeLength: 6,
};

export function validEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (email.length > limits.emailMax || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Введите корректную электронную почту.");
  }
  return email;
}

export function validProfile(value: ProfileData): ProfileData {
  const profile = {
    username: value.username.trim(), firstName: value.firstName.trim(), lastName: value.lastName.trim(),
    phone: value.phone.trim(), email: validEmail(value.email),
  };
  if (!/^[\p{L}\p{N}_.-]{3,30}$/u.test(profile.username)) throw new Error("Проверьте имя пользователя.");
  if (!profile.firstName || profile.firstName.length > limits.nameMax) throw new Error("Проверьте поле «Имя».");
  if (profile.lastName.length > limits.nameMax) throw new Error("Проверьте поле «Фамилия».");
  if (profile.phone.length > limits.phoneMax || (profile.phone && !/^[+\d\s().-]+$/.test(profile.phone))) {
    throw new Error("Введите корректный телефон.");
  }
  return profile;
}

export function ensureUnique(accounts: Account[], profile: ProfileData, excludedId?: string) {
  if (accounts.some((user) => user.id !== excludedId &&
    (user.username.toLowerCase() === profile.username.toLowerCase() || user.email === profile.email))) {
    throw new Error("Почта или имя пользователя уже заняты.");
  }
}

export async function digestPassword(value: FormDataEntryValue | null, isNew = false) {
  if (typeof value !== "string" || !value.length) {
    throw new Error("Введите пароль.");
  }
  if (isNew && (value.length < limits.passwordMin || value.length > limits.passwordMax)) {
    throw new Error(`Пароль: от ${limits.passwordMin} до ${limits.passwordMax} символов.`);
  }
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function availableUsername(accounts: Account[], email: string) {
  const base = email.split("@")[0].slice(0, limits.usernameMax);
  let username = base;
  let suffix = 1;
  while (accounts.some((account) => account.username.toLowerCase() === username.toLowerCase())) {
    const ending = String(suffix++);
    username = `${base.slice(0, limits.usernameMax - ending.length)}${ending}`;
  }
  return username;
}

export function profileValues(values: FormData): ProfileData {
  return {
    username: String(values.get("username") ?? ""),
    firstName: String(values.get("firstName") ?? ""),
    lastName: String(values.get("lastName") ?? ""),
    phone: String(values.get("phone") ?? ""),
    email: String(values.get("email") ?? ""),
  };
}
