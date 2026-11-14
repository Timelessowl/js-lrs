import { paths } from "../routes";
import { Alert, IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { GoogleSignIn } from "./GoogleSignIn";
import * as Storage from "../storage";

export function OtherLoginMethods({ remember }: { remember: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function loginWithPasskey() {
    setBusy(true);
    setError("");
    try {
      const state = await Storage.loadStore();
      const user = state.data.accounts.find(
        (user) => user.id === state.data.passkeyUserId,
      );
      if (!user) throw new Error("Ключ доступа не добавлен.");
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
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Typography component="h2" variant="subtitle2" align="center">
        Другие способы входа
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", alignItems: "flex-start" }}
        role="group"
        aria-label="Другие способы входа"
      >
        <GoogleSignIn remember={remember} iconOnly />
        <IconButton
          type="button"
          aria-label="Войти с ключом доступа"
          disabled={busy}
          onClick={loginWithPasskey}
          sx={{
            width: 48,
            height: 48,
            border: 1,
            borderColor: "divider",
            borderRadius: "50%",
            color: "text.primary",
          }}
        >
          <KeyRoundedIcon />
        </IconButton>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
