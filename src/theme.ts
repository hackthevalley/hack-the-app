import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import {
  buttonRecipe,
  cardSlotRecipe,
  inputRecipe,
  switchSlotRecipe,
  tabsSlotRecipe,
} from "@chakra-ui/react/theme";

const appVisualConfig = defineConfig({
  globalCss: {
    "html, body, #root": {
      bg: { _light: "white", _dark: "gray.800" },
      color: { _light: "gray.800", _dark: "whiteAlpha.900" },
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: "{colors.white}", _dark: "{colors.gray.800}" },
          },
          panel: {
            value: { _light: "{colors.white}", _dark: "{colors.gray.800}" },
          },
        },
        fg: {
          DEFAULT: {
            value: {
              _light: "{colors.gray.800}",
              _dark: "{colors.whiteAlpha.900}",
            },
          },
        },
        border: {
          DEFAULT: {
            value: {
              _light: "{colors.gray.200}",
              _dark: "{colors.whiteAlpha.300}",
            },
          },
          emphasized: {
            value: {
              _light: "{colors.gray.300}",
              _dark: "{colors.whiteAlpha.400}",
            },
          },
        },
        gray: {
          fg: {
            value: {
              _light: "{colors.gray.800}",
              _dark: "{colors.whiteAlpha.900}",
            },
          },
          subtle: {
            value: {
              _light: "{colors.gray.100}",
              _dark: "{colors.whiteAlpha.200}",
            },
          },
          muted: {
            value: {
              _light: "{colors.gray.200}",
              _dark: "{colors.whiteAlpha.300}",
            },
          },
          border: {
            value: {
              _light: "{colors.gray.200}",
              _dark: "{colors.whiteAlpha.300}",
            },
          },
        },
        blue: {
          solid: {
            value: {
              _light: "{colors.blue.500}",
              _dark: "{colors.blue.200}",
            },
          },
          focusRing: {
            value: {
              _light: "{colors.blue.500}",
              _dark: "{colors.blue.200}",
            },
          },
        },
      },
    },
    recipes: {
      button: {
        ...buttonRecipe,
        defaultVariants: {
          size: "md",
          variant: "subtle",
          colorPalette: "gray",
        },
      },
      input: {
        ...inputRecipe,
        defaultVariants: {
          size: "md",
          variant: "outline",
          colorPalette: "blue",
        },
      },
    },
    slotRecipes: {
      card: {
        ...cardSlotRecipe,
        defaultVariants: {
          size: "md",
          variant: "elevated",
        },
      },
      switch: {
        ...switchSlotRecipe,
        defaultVariants: {
          size: "md",
          variant: "solid",
          colorPalette: "blue",
        },
      },
      tabs: {
        ...tabsSlotRecipe,
        defaultVariants: {
          size: "md",
          variant: "line",
          colorPalette: "blue",
        },
      },
    },
  },
});

export const appSystem = createSystem(defaultConfig, appVisualConfig);
