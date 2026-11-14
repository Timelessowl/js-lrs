import { paths } from "../routes";
import { Link } from "@mui/material";
import { Form } from "../components/Form";
import { PasswordField } from "../components/Fields";
import * as Utils from "../utils";
import * as Storage from "../storage";

export function PasswordPage({ adding }: { adding: boolean }) {
  return (
    <>
      <h1>{adding ? "Установить пароль" : "Изменить пароль"}</h1>
      <Form
        label={adding ? "Добавить" : "Изменить"}
        onSubmit={async (values) => {
          const passwordHash = await Utils.digestPassword(
            values.get("password"),
            true,
          );
          const currentHash = adding
            ? undefined
            : await Utils.digestPassword(values.get("currentPassword"));
          const state = await Storage.loadStore();
          const user = Storage.requireUser(state);
          if (adding && user.passwordHash)
            throw new Error(
              "Пароль уже установлен. Используйте изменение пароля.",
            );
          if (user.passwordHash && user.passwordHash !== currentHash)
            throw new Error("Неверный текущий пароль.");
          user.passwordHash = passwordHash;
          delete user.reset;
          Storage.saveData(state.data);
          location.replace(paths.profileSecurity);
        }}
      >
        {!adding && (
          <PasswordField
            name="currentPassword"
            label="Текущий пароль"
            current
          />
        )}
        <PasswordField label="Новый пароль" />
      </Form>
      <p className="page-link">
        <Link href={paths.profileSecurity}>К настройкам безопасности</Link>
      </p>
    </>
  );
}
