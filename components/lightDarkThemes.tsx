import type { Theme } from "@react-navigation/native";

const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: "rgb(10, 132, 255)",
    background: "#181B2B", // #161622, Deep Charcoal: #1A1A2E, carbon black: #121212, Best: #181B2B
    card: "rgb(18, 18, 18)",
    text: "#fff",
    border: "rgb(39, 39, 41)",
    notification: "rgb(255, 69, 58)",
  },
};

const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: "rgb(0, 122, 255)",
    background: "#F5F5F5", // Bright to low: Soft white: #FFFFFF, #F5F5F5 (popular white?), #F2F2F2 (good), #EDEDED (not bad)
    card: "rgb(255, 255, 255)",
    text: "#333",
    border: "rgb(216, 216, 216)",
    notification: "rgb(255, 59, 48)",
  },
};

export { DarkTheme, DefaultTheme };
