import React from "react";
import { Box, SxProps, Typography, styled, useTheme } from "@mui/material";
import { ReactComponent as CaratDown } from "../../assets/carat-down.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import logoUrl from "../../assets/logo.svg";

const StyledLink = styled("a")({
  textDecoration: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const HeaderTypography = styled(Typography)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  fontFamily: "Quicksand",
  fontSize: "1.25rem",
  cursor: "pointer",
});

export const MenuContainer = styled("a")({
  textDecoration: "none",
  padding: "0.5rem .75rem",

  "& > .children": {
    display: "none",
  },

  "&:hover > .children": {
    display: "block",
  },
});

export const Menu = styled("div")({
  display: "flex",
  flexDirection: "column",
  borderRadius: "4px",
  border: `2px solid #d6d6d6`,
  background: "#ffffff",
  padding: ".375rem 0",
  minWidth: 236,

  "& a": {
    display: "block",
    padding: "0.25rem 0.75rem",
    fontWeight: 400,

    "&:hover": {
      background: "#FF8787",
    },
  },
});

export const SearchStyledInput = styled("input")({
  flex: 1,
  color: "#21242B",
  fontFamily: "Open Sans",
  fontSize: "1rem",
  fontStyle: "normal",
  fontWeight: 400,
  border: "none",
  boxSizing: "border-box",
  outline: "none",
});

export const SearchInput = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "24px",
        border: "1px solid #A1AABF",
        padding: "0.5rem 0.75rem",
        width: 346,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <SearchStyledInput ref={inputRef} placeholder="Search for resources..." />
      <SearchIcon />
    </Box>
  );
};

export interface MenuItemProps {
  title: string;
  href?: string;
  children?: React.ReactNode;
  sx?: SxProps;
}

export const MenuItem = ({ href, title, children, sx }: MenuItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // listen for clicks or escape to close the menu
  React.useEffect(() => {
    const closeMenu = () => isOpen && setIsOpen(false);

    document.addEventListener("click", closeMenu);
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("keyup", closeMenu);
    };
  }, [isOpen]);

  return (
    <MenuContainer href={href} sx={{ position: "relative", ...sx }}>
      <HeaderTypography onClick={() => setIsOpen(!isOpen)}>
        {title}

        {children && <CaratDown style={{ marginLeft: "0.5rem" }} />}
      </HeaderTypography>

      {children && isOpen && (
        <Typography
          variant="body1"
          style={{
            display: "block",
            position: "absolute",
            left: 0,
            top: "100%",
            minWidth: "calc(100% + 2px)",
          }}
        >
          {children}
        </Typography>
      )}
    </MenuContainer>
  );
};

export const Header = () => {
  const theme = useTheme();

  return (
    <header
      style={{
        backgroundColor: theme.palette.background.default,
        borderBottom: `5px solid gradient(#70B2F1, #FFFFFF, #FF8787)`,
      }}
    >
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <StyledLink href="/" style={{ textDecoration: "none" }}>
          <img src={logoUrl} alt="logo" />
          <HeaderTypography sx={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}>
            Transgender.org
          </HeaderTypography>
        </StyledLink>
        <MenuItem title="Home" href="/" sx={{ marginLeft: "1.5rem" }} />
        <MenuItem title="About" href="/about" />
        <MenuItem title="Education" href="/education" />
        <MenuItem title="Resources">
          <Menu>
            <a>MTF</a>
            <a>FTM</a>
            <a>Non-Binary</a>
            <a>Intersex</a>
          </Menu>
        </MenuItem>
        <SearchInput />
      </Box>
      <Box
        sx={{
          background: "linear-gradient(to right, #70B2F1, #FFFFFF, #FF8787)",
          width: "100%",
          height: 5,
        }}
      />
    </header>
  );
};
