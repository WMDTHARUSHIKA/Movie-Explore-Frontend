import React, { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const ThemeModeContext = createContext(null);

export function CustomThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem("movie_explorer_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const toggleMode = () => {
    setMode((m) => {
      const next = m === "dark" ? "light" : "dark";
      localStorage.setItem("movie_explorer_theme", next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used inside CustomThemeProvider");
  return ctx;
}