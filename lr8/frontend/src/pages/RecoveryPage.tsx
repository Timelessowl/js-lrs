import { paths } from "../routes";
import { Alert, Link } from "@mui/material";
import { useState } from "react";
import * as Utils from "../utils";
import { Form } from "../components/Form";
import { EmailField, PasswordField } from "../components/Fields";
import * as Storage from "../storage";

export function RecoveryPage() {
  const reset = location.pathname === paths.resetPassword;
  const token = new URLSearchParams(location.search).get("token");
  const [done, setDone] = useState(false);
  return (
    <>
      <h1>Восстановление пароля</h1>
      {done ? (
        <Alert severity={reset ? "success" : "info"}>
          {reset
            ? "Пароль изменён. Войдите с новым паролем."
            : "Если аккаунт существует, запрос на восстановление принят."}
        </Alert>
      ) : (
        <Form
          label={reset ? "Изменить пароль" : "Далее"}
          onSubmit={async (values) => {
            if (reset) {
              const passwordHash = await Utils.digestPassword(
                values.get("password"),
                true,
              );
              if (!token) throw new Error("Некорректный запрос.");
              const state = await Storage.loadStore();
              const user = state.data.accounts.find(
                (user) => user.reset?.token === token,
              );
              if (!user?.reset || user.reset.expiresAt <= Date.now())
                throw new Error(
                  "Ссылка недействительна или срок её действия истёк.",
                );
              user.passwordHash = passwordHash;
              delete user.reset;
              Storage.saveData(state.data);
              Storage.saveSession({});
            } else {
              const email = Utils.validEmail(String(values.get("email") ?? ""));
              const state = await Storage.loadStore();
              const user = state.data.accounts.find(
                (user) => user.email === email && user.passwordHash,
              );
              if (user) {
                const token =
                  crypto.randomUUID().replaceAll("-", "") +
                  crypto.randomUUID().replaceAll("-", "");
                user.reset = {
                  token,
                  expiresAt: Date.now() + Storage.validity.reset,
                };
                Storage.saveData(state.data);
                console.info(
                  "Password reset link:",
                  new URL(
                    `${paths.resetPassword}?token=${token}`,
                    location.origin,
                  ).href,
                );
              }
            }
            setDone(true);
          }}
        >
          {reset ? <PasswordField label="Новый пароль" /> : <EmailField />}
        </Form>
      )}
      <p className="page-link">
        <Link href={paths.login}>Вернуться ко входу</Link>
      </p>
    </>
  );
}
