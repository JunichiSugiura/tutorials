import { base, dark } from "@theme-ui/presets";
import { merge, useColorMode } from "theme-ui";
import { useCallback } from "react";

export const theme = merge(base, {
  styles: {
    root: {
      button: {
        background: "none",
        color: "inherit",
        border: "none",
        padding: 0,
        font: "inherit",
        cursor: "pointer",
        outline: "inherit",
      },
    },
  },
  colors: {
    ...base.colors,
    modes: {
      dark: dark.colors,
    },
  },
});

enum ColorMode {
  Default = "default",
  Dark = "dark",
}

export function useToggleColorMode() {
  const [mode, setColorMode] = useColorMode();

  return useCallback(() => {
    const newMode =
      mode === ColorMode.Default ? ColorMode.Dark : ColorMode.Default;
    setColorMode(newMode);
  }, [mode]);
}
