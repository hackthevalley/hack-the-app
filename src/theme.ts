import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const legacyVisualConfig = defineConfig({
  globalCss: {
    "html, body, #root": {
      bg: { base: "white", _dark: "gray.800" },
      color: { base: "gray.800", _dark: "whiteAlpha.900" },
    },
  },
  theme: {
    recipes: {
      button: {
        defaultVariants: {
          size: "md",
          variant: "subtle",
          colorPalette: "gray",
        },
      },
      input: {
        defaultVariants: {
          size: "md",
          variant: "outline",
          colorPalette: "blue",
        },
      },
    },
    slotRecipes: {
      card: {
        defaultVariants: {
          size: "md",
          variant: "elevated",
        },
      },
      switch: {
        defaultVariants: {
          size: "md",
          variant: "solid",
          colorPalette: "blue",
        },
      },
      tabs: {
        defaultVariants: {
          size: "md",
          variant: "line",
          colorPalette: "blue",
        },
      },
    },
  },
});

export const appSystem = createSystem(defaultConfig, legacyVisualConfig);
