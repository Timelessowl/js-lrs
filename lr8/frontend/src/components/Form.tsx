import { Alert, Button, Stack } from "@mui/material";
import { useState, type SubmitEvent } from "react";
import type { FormProps } from "../types";

export function Form({ children, label, onSubmit, success }: FormProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const element = event.currentTarget;
    const values = new FormData(element);
    setBusy(true);
    setError("");
    setDone(false);
    try {
      await onSubmit(values);
      setDone(true);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Произошла ошибка.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Stack component="form" spacing={2} onSubmit={submit}>
      <fieldset disabled={busy} className="form-fields">
        {children}
      </fieldset>
      {error && <Alert severity="error">{error}</Alert>}
      {done && success && <Alert severity="success">{success}</Alert>}
      <Button variant="contained" disableElevation type="submit" loading={busy}>
        {label}
      </Button>
    </Stack>
  );
}
