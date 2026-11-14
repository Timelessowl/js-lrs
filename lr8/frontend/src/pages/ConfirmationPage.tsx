import { paths } from "../routes";
import { Link } from "@mui/material";
import * as Utils from "../utils";
import { Form } from "../components/Form";
import { CodeField } from "../components/Fields";
import * as Storage from "../storage";

export function ConfirmationPage() {
  return (
    <>
      <h1>Подтверждение регистрации</h1>
      <p>Подтвердите электронную почту, чтобы создать аккаунт.</p>
      <Form
        label="Подтвердить"
        onSubmit={async (values) => {
          const state = await Storage.loadStore();
          const pending = state.session.registration;
          if (!pending || pending.expiresAt <= Date.now())
            throw new Error("Начните регистрацию заново.");
          if (values.get("code") !== "000000")
            throw new Error("Неверный код подтверждения.");
          Utils.ensureUnique(state.data.accounts, pending.profile);
          const user = {
            ...pending.profile,
            id: crypto.randomUUID(),
            passwordHash: pending.passwordHash,
          };
          state.data.accounts.push(user);
          Storage.saveData(state.data);
          Storage.signIn(user.id);
          location.replace(paths.profile);
        }}
      >
        <CodeField />
      </Form>
      <p className="page-link">
        <Link href={paths.register}>Начать регистрацию заново</Link>
      </p>
    </>
  );
}
