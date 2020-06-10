import theme from "@theme-ui/preset-base";
import { darken, lighten } from "@theme-ui/color";

export default {
  ...theme,
  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: "Georgia, serif",
    monospace: "Menlo, monospace",
  },
  container: {
    maxWidth: 768,
    fontSize: 0,
  },
  breakpoints: ["40em"],
  colors: {
    text: "dimgray",
    background: "lemonchiffon",
    primary: "darkorange",
    muted: "ivory",
    danger: "indianred",
  },
  styles: {
    ...theme,
    a: {
      color: "royalblue",
      fontSize: 0,
    },
  },
  text: {
    heading: {
      color: "royalblue",
      fontSize: 3,
      fontStyle: "italic",
    },
  },
  buttons: {
    primary: {
      outline: "none",
      cursor: "pointer",
      color: "white",
      fontWeight: "bold",
      bg: "primary",
      borderBottomWidth: 4,
      borderStyle: "solid",
      borderColor: darken("primary", 0.1),
      "&:hover": {
        bg: lighten("primary", 0.1),
        borderColor: "primary",
      },
      "&:focus": {
        bg: lighten("primary", 0.1),
        borderColor: "primary",
      },
      "&:active": {
        bg: lighten("primary", 0.1),
        borderColor: "primary",
      },
    },
    sorter: {
      cursor: "pointer",
      textAlign: "left",
      fontSize: 0,
      px: 1,
      py: 2,
      color: "text",
      bg: "background",
      borderRadius: 0,
      borderBottomWidth: 2,
      borderColor: lighten("primary", 0.3),
      width: "100%",
      "&:hover": {
        bg: "muted",
        borderColor: "primary",
      },
      "&:focus": {
        bg: "muted",
        borderColor: "primary",
      },
      "&:active": {
        bg: "muted",
        borderColor: "primary",
      },
    },
    icon: {
      cursor: "pointer",
    },
  },
  forms: {
    input: {
      py: 2,
      px: 3,
      width: "auto",
      bg: "muted",
      borderWidth: 0,
      "&:hover": {
        bg: "white",
      },
    },
  },
};
