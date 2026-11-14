import { paths } from "../routes";
import { Alert, Button, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import type { Account } from "../types";
import * as Utils from "../utils";
import { Form } from "../components/Form";
import { ProfileFields } from "../components/Fields";
import { SecuritySettings } from "../components/SecuritySettings";
import * as Storage from "../storage";

function General({
  account,
  onUpdate,
}: {
  account: Account;
  onUpdate: (account: Account) => void;
}) {
  return (
    <section aria-labelledby="general-heading">
      <h2 id="general-heading">Общие данные</h2>
      <Form
        label="Сохранить изменения"
        success="Данные сохранены."
        onSubmit={async (values) => {
          const profile = Utils.validProfile(Utils.profileValues(values));
          const state = await Storage.loadStore();
          const user = Storage.requireUser(state);
          Utils.ensureUnique(state.data.accounts, profile, user.id);
          Object.assign(user, profile);
          delete user.reset;
          Storage.saveData(state.data);
          onUpdate(Storage.publicProfile(user));
        }}
      >
        <ProfileFields value={account} />
      </Form>
    </section>
  );
}

export function ProfilePage({
  account,
  onUpdate,
}: {
  account: Account;
  onUpdate: (account: Account) => void;
}) {
  const [tab, setTab] = useState<number>(
    `${location.pathname}${location.search}` === paths.profileSecurity ? 1 : 0,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function logout() {
    setBusy(true);
    setError("");
    try {
      Storage.saveSession({});
      location.replace(paths.login);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Не удалось выйти.",
      );
      setBusy(false);
    }
  }
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "start" }}
      >
        <h1>Личный кабинет</h1>
        <Button variant="outlined" loading={busy} onClick={logout}>
          Выйти
        </Button>
      </Stack>
      <Tabs
        value={tab}
        onChange={(_event, value: number) => setTab(value)}
        aria-label="Настройки профиля"
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab
          value={0}
          label="Общие данные"
          id="general-tab"
          aria-controls="general-panel"
        />
        <Tab
          value={1}
          label="Безопасность"
          id="security-tab"
          aria-controls="security-panel"
        />
      </Tabs>
      <div
        role="tabpanel"
        id={tab === 0 ? "general-panel" : "security-panel"}
        aria-labelledby={tab === 0 ? "general-tab" : "security-tab"}
      >
        {tab === 0 ? (
          <General account={account} onUpdate={onUpdate} />
        ) : (
          <SecuritySettings />
        )}
      </div>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </>
  );
}
