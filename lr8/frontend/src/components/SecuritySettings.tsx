import { paths } from "../routes";
import { Alert, Button, Divider, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { useEffect, useState, type ReactNode } from "react";
import { LoginMethod } from "../types";
import type { SecurityData } from "../types";
import * as Storage from "../storage";

function MethodRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        py: 2,
        minHeight: 64,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {icon}
        <Typography>{label}</Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {children}
      </Stack>
    </Stack>
  );
}

export function SecuritySettings() {
  const [security, setSecurity] = useState<SecurityData>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<LoginMethod | null>(null);
  async function refresh() {
    setSecurity(Storage.securityData(await Storage.loadStore()));
    setError("");
  }
  useEffect(() => {
    refresh().catch((failure) =>
      setError(
        failure instanceof Error ? failure.message : "Произошла ошибка.",
      ),
    );
  }, []);
  async function togglePasskey() {
    setBusy(LoginMethod.Passkey);
    setError("");
    try {
      const state = await Storage.loadStore();
      const user = Storage.requireUser(state);
      if (state.data.passkeyUserId === user.id) {
        if (!user.passwordHash && !user.googleSubject)
          throw new Error("Нельзя удалить последний способ входа.");
        delete state.data.passkeyUserId;
      } else {
        if (state.data.passkeyUserId)
          throw new Error(
            "Ключ доступа уже добавлен для другого аккаунта в этом браузере.",
          );
        state.data.passkeyUserId = user.id;
      }
      Storage.saveData(state.data);
      setSecurity(Storage.securityData(state));
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Произошла ошибка.",
      );
    } finally {
      setBusy(null);
    }
  }
  async function toggleGoogle() {
    setBusy(LoginMethod.Google);
    setError("");
    try {
      const state = await Storage.loadStore();
      const user = Storage.requireUser(state);
      if (user.googleSubject) {
        if (!user.passwordHash && state.data.passkeyUserId !== user.id)
          throw new Error("Нельзя удалить последний способ входа.");
        delete user.googleSubject;
      } else {
        if (
          state.data.accounts.some(
            (account) =>
              account.googleSubject === Storage.googleAccount.subject,
          )
        ) {
          throw new Error(
            "Этот аккаунт Google уже привязан к другому пользователю.",
          );
        }
        user.googleSubject = Storage.googleAccount.subject;
      }
      Storage.saveData(state.data);
      setSecurity(Storage.securityData(state));
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Произошла ошибка.",
      );
    } finally {
      setBusy(null);
    }
  }
  const hasPassword = security?.loginMethods.includes(LoginMethod.Password);
  const hasPasskey = security?.loginMethods.includes(LoginMethod.Passkey);
  const hasGoogle = security?.loginMethods.includes(LoginMethod.Google);
  const onlyMethod = security?.loginMethods.length === 1;
  return (
    <section aria-labelledby="security-heading">
      <h2 id="security-heading">Безопасность</h2>
      {!security && !error && <p role="status">Загрузка…</p>}
      {security && (
        <Stack divider={<Divider />}>
          <MethodRow label="Пароль">
            <Button
              variant="outlined"
              href={hasPassword ? paths.changePassword : paths.addPassword}
              disabled={busy !== null}
              sx={{ minWidth: 96 }}
            >
              {hasPassword ? "Изменить" : "Добавить"}
            </Button>
          </MethodRow>
          <MethodRow label="Passkey" icon={<KeyRoundedIcon />}>
            <Button
              variant="outlined"
              loading={busy === LoginMethod.Passkey}
              disabled={busy !== null || (hasPasskey && onlyMethod)}
              onClick={togglePasskey}
              sx={{ minWidth: 96 }}
            >
              {hasPasskey ? "Удалить" : "Добавить"}
            </Button>
          </MethodRow>
          <MethodRow label="Google" icon={<GoogleIcon />}>
            {hasGoogle && (
              <Typography variant="body2" color="text.secondary">
                Привязан
              </Typography>
            )}
            <Button
              variant="outlined"
              loading={busy === LoginMethod.Google}
              disabled={busy !== null || (hasGoogle && onlyMethod)}
              onClick={toggleGoogle}
              sx={{ minWidth: 96 }}
            >
              {hasGoogle ? "Отвязать" : "Настроить"}
            </Button>
          </MethodRow>
        </Stack>
      )}
      {error && (
        <>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
          <Button
            onClick={() => {
              refresh().catch((failure) =>
                setError(
                  failure instanceof Error
                    ? failure.message
                    : "Произошла ошибка.",
                ),
              );
            }}
          >
            Повторить
          </Button>
        </>
      )}
    </section>
  );
}
