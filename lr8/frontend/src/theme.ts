import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: { primary: { main: "#2858ad" }, text: { primary: "#202b3c" } },
  shape: { borderRadius: 6 },
  typography: { fontFamily: "system-ui, sans-serif", button: { textTransform: "none" } },
});
