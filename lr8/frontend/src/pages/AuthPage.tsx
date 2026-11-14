import { paths } from "../routes";
import { Checkbox, FormControlLabel, Link } from "@mui/material";
import { useState } from "react";
import * as Utils from "../utils";
import { Form } from "../components/Form";
import { Field, PasswordField, ProfileFields } from "../components/Fields";
import { GoogleSignIn } from "../components/GoogleSignIn";
import { OtherLoginMethods } from "../components/OtherLoginMethods";
import * as Storage from "../storage";

export function AuthPage({ registration }: { registration: boolean }) {
  const [remember, setRemember] = useState(false);
  async function submit(values: FormData) {
    const passwordHash = await Utils.digestPassword(
      values.get("password"),
      registration,
    );
    const state = await Storage.loadStore();
    if (registration) {
      const profile = Utils.validProfile(Utils.profileValues(values));
      Utils.ensureUnique(state.data.accounts, profile);
      state.session.registration = {
        profile,
        passwordHash,
        expiresAt: Date.now() + Storage.validity.registration,
      };
      Storage.saveSession(state.session);
      location.assign(paths.confirmRegistration);
      return;
    }
    const login = String(values.get("login") ?? "")
      .trim()
      .toLowerCase();
    const user = state.data.accounts.find(
      (user) => user.username.toLowerCase() === login,
    );
    if (!user?.passwordHash || user.passwordHash !== passwordHash)
      throw new Error("Неверный логин или пароль.");
    Storage.signIn(user.id, values.get("remember") === "on");
    location.replace(paths.profile);
  }
  return (
    <>
      <h1>{registration ? "Регистрация" : "Вход"}</h1>
      <Form label={registration ? "Далее" : "Войти"} onSubmit={submit}>
        {registration ? (
          <ProfileFields />
        ) : (
          <Field
            label="Логин"
            name="login"
            autoComplete="username"
            required
            slotProps={{ htmlInput: { maxLength: Utils.limits.loginMax } }}
          />
        )}
        <PasswordField current={!registration} />
        {!registration && (
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                checked={remember}
                onChange={(_event, checked) => setRemember(checked)}
              />
            }
            label="Запомнить меня"
          />
        )}
      </Form>
      {registration ? (
        <GoogleSignIn remember={remember} />
      ) : (
        <OtherLoginMethods remember={remember} />
      )}
      <p className="page-link">
        {registration ? (
          <Link href={paths.login}>Вернуться ко входу</Link>
        ) : (
          <>
            Нет аккаунта? <Link href={paths.register}>Зарегистрироваться</Link>
          </>
        )}
      </p>
      {!registration && (
        <p className="page-link">
          <Link href={paths.forgotPassword}>Забыли пароль?</Link>
        </p>
      )}
    </>
  );
}
