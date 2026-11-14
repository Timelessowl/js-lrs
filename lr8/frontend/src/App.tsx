import { paths, protectedPaths } from "./routes";
import { theme } from "./theme";
import { Alert, Button, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import type { Account } from "./types";
import { AuthPage } from "./pages/AuthPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecoveryPage } from "./pages/RecoveryPage";
import { PasswordPage } from "./pages/PasswordPage";
import * as Storage from "./storage";

const page = `/${location.pathname.split("/")[1]?.toLowerCase() ?? ""}`;

function GuestPage() {
  if (page === paths.confirmRegistration) return <ConfirmationPage />;
  if (page === paths.forgotPassword || page === paths.resetPassword) return <RecoveryPage />;
  return <AuthPage registration={page === paths.register} />;
}

function AccountPage({ account, onUpdate }: { account: Account; onUpdate: (account: Account) => void }) {
  if (page === paths.addPassword || page === paths.changePassword) {
    return <PasswordPage adding={page === paths.addPassword} />;
  }
  return <ProfilePage account={account} onUpdate={onUpdate} />;
}

export function App() {
  const [account, setAccount] = useState<Account | null>();
  const [error, setError] = useState("");
  useEffect(() => {
    Storage.loadStore().then((state) => {
      const stored = Storage.currentUser(state);
      const user = stored ? Storage.publicProfile(stored) : null;
      if (user && !protectedPaths.includes(page) && page !== paths.resetPassword) return location.replace(paths.profile);
      if (!user && protectedPaths.includes(page)) return location.replace(paths.login);
      setAccount(page === paths.resetPassword ? null : user);
    }).catch(() => setError("Не удалось загрузить страницу."));
  }, []);
  return <ThemeProvider theme={theme}><Paper component="main" variant="outlined" sx={{ p: "clamp(18px, 5vw, 28px)", borderRadius: "10px" }}>
    {account === undefined && !error && <p role="status">Загрузка…</p>}
    {account === null && <GuestPage />}
    {account && <AccountPage account={account} onUpdate={setAccount} />}
    {error && <><Alert severity="error">{error}</Alert>
      <Button onClick={() => location.reload()} sx={{ mt: 2 }}>Повторить</Button></>}
  </Paper></ThemeProvider>;
}
