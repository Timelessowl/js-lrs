import type { ReactNode } from "react";

export interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Account extends ProfileData {
  id: string;
}

export interface SecurityData {
  loginMethods: LoginMethod[];
}

export enum LoginMethod {
  Password = "password",
  Passkey = "passkey",
  Google = "google",
}

export interface StoredAccount extends Account {
  passwordHash: string | null;
  googleSubject?: string;
  reset?: { token: string; expiresAt: number };
}

export interface Session {
  userId?: string;
  remember?: boolean;
  expiresAt?: number;
  registration?: {
    profile: ProfileData;
    passwordHash: string;
    expiresAt: number;
  };
}

export interface BrowserState {
  data: {
    accounts: StoredAccount[];
    passkeyUserId?: string;
  };
  session: Session;
}

export interface FormProps {
  children: ReactNode;
  label: string;
  onSubmit: (values: FormData) => Promise<void>;
  success?: string;
}
