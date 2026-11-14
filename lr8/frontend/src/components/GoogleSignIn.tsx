import { Alert, Button, IconButton, Stack } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useState } from "react";
import { paths } from "../routes";
import * as Utils from "../utils";
import * as Storage from "../storage";

export function GoogleSignIn({
  remember = false,
  iconOnly = false,
}: {
  remember?: boolean;
  iconOnly?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function signIn() {
    setBusy(true);
    setError("");
    try {
      const state = await Storage.loadStore();
      let user = state.data.accounts.find(
        (user) => user.googleSubject === Storage.googleAccount.subject,
      );
      if (!user) {
        const profile = Utils.validProfile({
          ...Storage.googleAccount.profile,
          username: Utils.availableUsername(
            state.data.accounts,
            Storage.googleAccount.profile.email,
          ),
        });
        user = {
          ...profile,
          id: crypto.randomUUID(),
          passwordHash: null,
          googleSubject: Storage.googleAccount.subject,
        };
        state.data.accounts.push(user);
        Storage.saveData(state.data);
      }
      Storage.signIn(user.id, remember);
      location.replace(paths.profile);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Произошла ошибка.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Stack spacing={2} sx={iconOnly ? undefined : { mt: 2 }}>
      {iconOnly ? (
        <IconButton
          type="button"
          aria-label="Войти через Google"
          disabled={busy}
          onClick={signIn}
          sx={{
            width: 48,
            height: 48,
            border: 1,
            borderColor: "divider",
            borderRadius: "50%",
            color: "text.primary",
          }}
        >
          <GoogleIcon />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          disabled={busy}
          onClick={signIn}
          sx={{
            alignSelf: "flex-start",
            display: busy ? "none" : "inline-flex",
            width: 208,
            height: 40,
            borderRadius: "4px",
            borderColor: "#747775",
            color: "#1f1f1f",
            fontFamily: "Google Sans, Arial, sans-serif",
          }}
        >
          Войти через Google
        </Button>
      )}
      {busy && !iconOnly && <p role="status">Подтверждение входа…</p>}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
