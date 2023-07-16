import React from "react";
import { Box, SxProps, Typography, styled, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CaratDown } from "../../assets/carat-down.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as Discord } from "../../assets/discord.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as EscapeButton } from "../../assets/escape-button.svg";
import logoUrl from "../../assets/logo.svg";
import { Button } from "../button";

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

export const MenuItemContainer = styled("a")({
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

export const StyledDiscordLink = styled("a")({
  marginLeft: "0.5rem",
  lineHeight: 0,
  "@media (max-width: 1200px)": {
    marginTop: "0.5rem",
    marginLeft: 0,
  },
});

export interface SearchInputProps {
  className?: string;
  sx?: SxProps;
}

export const SearchInput = ({ className, sx }: SearchInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "24px",
        border: "1px solid #A1AABF",
        padding: "0.5rem 0.75rem",
        width: 346,
        "@media (max-width: 1200px)": {
          marginTop: "0.5rem",
        },
        ...sx,
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

  const navigate = useNavigate();

  // listen for clicks or escape to close the menu
  React.useEffect(() => {
    const closeMenu = () => isOpen && setIsOpen(false);

    document.addEventListener("click", closeMenu);
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeMenu();
      }
    });

    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("keyup", closeMenu);
    };
  }, [isOpen]);

  return (
    <MenuItemContainer
      href={href}
      onClick={(e) => {
        if (href) {
          e.preventDefault();
          navigate(href);
        }
      }}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      <HeaderTypography onClick={() => setIsOpen(!isOpen)}>
        {title}

        {children && <CaratDown style={{ marginLeft: "0.5rem" }} />}
      </HeaderTypography>

      {children && isOpen && (
        <Typography
          variant="body1"
          sx={{
            display: "block",
            position: "absolute",
            left: 0,
            top: "100%",

            "@media (max-width: 1200px)": {
              position: "unset",
              marginTop: "0.5rem",
              left: "unset",
              top: "unset",
            },
          }}
        >
          {children}
        </Typography>
      )}
    </MenuItemContainer>
  );
};

export const StyledHeader = styled("header")((theme) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff",
  borderBottom: `5px solid gradient(#70B2F1, #FFFFFF, #FF8787)`,
}));

export const Header = () => {
  const theme = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigateToEscapeSite = () => {
    window.location.href = "https://rnewsbite.com";
  };

  // on escape, navigate to escape site
  React.useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        window.location.href = "https://rnewsbite.com";
      }
    };

    document.addEventListener("keyup", escape);

    return () => document.removeEventListener("keyup", escape);
  }, []);

  return (
    <StyledHeader
      sx={{
        "& .non-mobile-hide": {
          display: "none",
        },
        "@media (max-width: 1200px)": {
          "& .mobile-toggle": {
            display: isMobileMenuOpen ? "block" : "none",
          },
          "& .mobile-toggle-inverse": {
            display: isMobileMenuOpen ? "none" : "block",
          },

          "& .non-mobile-hide": {
            display: "flex",
          },
        },
      }}
    >
      <Box
        sx={{
          padding: "1rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",

          "@media (max-width: 1200px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            "@media (max-width: 1200px)": {
              width: "100%",
            },
          }}
        >
          <Box className="non-mobile-hide" sx={{ flex: 1 }}>
            <MenuIcon
              style={{ cursor: "pointer" }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </Box>
          <StyledLink
            href="/"
            sx={{
              display: "flex",
              flexDirection: "row",
              textDecoration: "none",
              userSelect: "none",
            }}
          >
            <img src={logoUrl} alt="logo" />
            <HeaderTypography sx={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}>
              Transgender.org
            </HeaderTypography>
          </StyledLink>
          <Box
            className="non-mobile-hide"
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <EscapeButton
              className="mobile-toggle-inverse"
              style={{ cursor: "pointer" }}
              onClick={navigateToEscapeSite}
            />
          </Box>
        </Box>
        <Box
          className="mobile-toggle"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,

            "@media (max-width: 1200px)": {
              flexDirection: "column",
              marginTop: "0.5rem",
            },
          }}
        >
          <MenuItem
            title="Home"
            href="/"
            sx={{
              marginLeft: "1.5rem",
              "@media (max-width: 1200px)": {
                marginLeft: 0,
              },
            }}
          />
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
        </Box>
        <SearchInput className="mobile-toggle" />
        <StyledDiscordLink
          className="mobile-toggle"
          href="https://discord.gg/wtRVNzpGkx"
          target="_blank"
          rel="noreferrer"
        >
          <Discord />
        </StyledDiscordLink>
        <Button
          className="mobile-toggle"
          onClick={navigateToEscapeSite}
          sx={{
            marginLeft: "0.5rem",
            "@media (max-width: 1200px)": {
              marginTop: "0.5rem",
              marginLeft: 0,
            },
          }}
        >
          Emergency Exit (ESC)
        </Button>
      </Box>
      <Box
        sx={{
          background: "linear-gradient(to right, #70B2F1, #FFFFFF, #FF8787)",
          height: 5,
        }}
      />
    </StyledHeader>
  );
};
