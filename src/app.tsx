import styled from "@emotion/styled";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./normalize.css";
import "./style.css";
import logoUrl from "./assets/logo.svg";
import appData from "./app-data.json";
import { LinkList } from "./link-list";
import useSearch from "./useSearch";
import { ThemeProvider, createTheme, useTheme } from "@mui/material";
import { Header } from "./ui/navigation/header";

export const AppContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "var(--bg-pink-gradient)",
  minHeight: "100vh",
});

export const AppLogo = styled("div")({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  height: "100px",

  "& img": {
    height: "100%",
  },
  "& h1": {
    marginLeft: "1rem",
    color: "white",
  },
});

export const Card = styled("div")({
  backgroundColor: "#fffb",
  borderRadius: "10px",
  backdropFilter: "blur(5px)",
  "-webkit-backdrop-filter": "blur(15px)",
  boxShadow: "var(--standard-shadow)",
});

export const Menu = styled("div")({
  display: "flex",
  flexDirection: "row",
  background: "var(--accent-1a)",
  height: "30px",
  borderRadius: "10px 10px 0 0",
  "& a": {
    background: `1px solid var(--accent-1a)`,
    border: `1px solid #fff`,
    borderWidth: "0 1px",
    whiteSpace: "nowrap",
    color: "black",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "30px",
    padding: "0 1rem",
    "&:hover": {
      background: "var(--accent-2a)",
      color: "#fff",
    },
    "& img": {
      height: "100%",
    },
  },
});

export interface MenuItemProps {
  title: string;
  href: string;
  position?: "bottom" | "right";
  children?: React.ReactNode;
}

export const MenuContainer = styled("a")({
  "& > .children": {
    display: "none",
  },

  "&:hover > .children": {
    display: "block",
  },
});

export const MenuItem = ({
  href,
  title,
  children,
  position = "right",
}: MenuItemProps) => {
  return (
    <MenuContainer href={href} style={{ position: "relative" }}>
      {title}

      {children && (
        <div
          className="children"
          style={{
            position: "absolute",
            left: position === "bottom" ? -1 : "100%",
            top: position === "bottom" ? "100%" : 0,
            minWidth: "calc(100% + 2px)",
          }}
        >
          {children}
        </div>
      )}
    </MenuContainer>
  );
};

const theme = createTheme({
  typography: {
    body1: {
      fontFamily: "OpenSans, sans-serif",
      fontSize: "1.5rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    h3: {
      fontFamily: "Mukta, sans-serif",
      fontSize: "2.5rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontFamily: "Mukta, sans-serif",
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
});

const App = () => {
  return (
    <>
      <ThemeProvider theme={{}}>
        <Header />
      </ThemeProvider>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
