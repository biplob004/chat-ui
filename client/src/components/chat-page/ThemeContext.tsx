// ThemeContext.tsx
"use client";

import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
} from "react";
import {
  ThemeProvider,
  createTheme,
  PaletteMode,
  CssBaseline,
} from "@mui/material";
import { GlobalStyles } from "@mui/material";

// Extend MUI's palette to include a custom colors
declare module "@mui/material/styles" {
  interface Palette {
    side_panel: {
      bg: string;
      active: string;
      hover: string;
      del_icon_bg: string;
      primary_btn: string;
      primary_btn_hover: string;
    };

    chat_input: {
      bg: string;
      text_box: string;
      icons: string;
    };

    chat_window: {
      bg: string;
      user_bg: string;
      ai_bg: string;
    };

    md_table: {
      header_text: string;
      header_bg: string;
      row_1: string;
      row_2: string;
    };
  }

  interface PaletteOptions {
    side_panel: {
      bg: string;
      active: string;
      hover: string;
      del_icon_bg: string;
      primary_btn: string;
      primary_btn_hover: string;

    };

    chat_input: {
      bg: string;
      text_box: string;
      icons: string;
    };

    chat_window: {
      bg: string;
      user_bg: string;
      ai_bg: string;
    };

    md_table: {
      header_text: string;
      header_bg: string;
      row_1: string;
      row_2: string;
    };
  }
}

interface ThemeContextProps {
  toggleTheme: () => void;
  mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextProps>({
  toggleTheme: () => {},
  mode: "light",
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProviderComponent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  // Persistent theme mode ['dark', 'light']
  useEffect(() => {
    // Run once on mount/refresh
    const themeMode = localStorage.getItem("theme_mode");
    if (themeMode) {
      setMode(themeMode as PaletteMode);
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever mode changes
    localStorage.setItem("theme_mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#1976d2" : "#90caf9",
          },
          secondary: {
            main: mode === "light" ? "#dc004e" : "#ff4081",
          },
          background: {
            default: mode === "light" ? "#ffffff" : "#343541",
            paper: mode === "light" ? "#f4f4f4" : "#444654",
          },
          text: {
            primary: mode === "light" ? "#000000" : "#ffffff",
          },
          side_panel: {
            bg: mode === "light" ? "#eff7ff" : "#171717",
            active: mode === "light" ? "#e8e8e880" : "#343541",
            hover: mode === "light" ? "#e8e8e880" : "#444654",
            del_icon_bg: mode === "light" ? "#f00" : "#f00",
            primary_btn: mode === "light" ? "#2b449f" : "#313131",
            primary_btn_hover: mode === "light" ? "#21388b" : "#626262",
          },
          chat_input: {
            bg: mode === "light" ? "#ff0" : "#1e1e1e",
            text_box: mode === "light" ? "#f3f3f3" : "#303030",
            icons: mode === "light" ? "#fff" : "#343541",
          },
          chat_window: {
            bg: mode === "light" ? "#ffffff" : "#212121",
            user_bg: mode === "light" ? "#e9e9e980" : "#313131", //"#f3f3f3" : "#303030",
            ai_bg: mode === "light" ? "#e9e9e980" : "#313131",
          },

          md_table: {
            header_text: mode === "light" ? "#bbdefb" : "#0d47a1",
            header_bg: mode === "light" ? "#0d47a1" : "#e3f2fd",
            row_1: mode === "light" ? "" : "",
            row_2: mode === "light" ? "" : "",
          },
        },

        typography: {
          fontFamily: "Poppins, Arial, sans-serif",
          h6: {
            fontWeight: 600,
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: mode === "light" ? "#e7e7e7" : "#252525",
              borderRadius: "4px",
            },
            "::-webkit-scrollbar-thumb:hover": {
              backgroundColor: mode === "light" ? "#a0a0a0" : "#333333",
            },
            "::-webkit-scrollbar-track": {
              backgroundColor: mode === "light" ? "#f9f9f9" : "#171717",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
