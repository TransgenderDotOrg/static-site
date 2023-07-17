import React, { useRef } from "react";
import { Box, SxProps, Typography, styled, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as CaratDown } from "../../assets/carat-down.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import { ReactComponent as Discord } from "../../assets/discord.svg";
import { ReactComponent as MenuIcon } from "../../assets/menu.svg";
import { ReactComponent as EscapeButton } from "../../assets/escape-button.svg";
import logoUrl from "../../assets/logo.svg";
import { Button } from "../button";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import tags from "../../../tags.json";

export const StyledLink = styled("a")({
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
  fontWeight: 400,
  cursor: "pointer",
});

export const MenuItemContainer = styled("div")({
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
  defaultValue?: string;
  className?: string;
  sx?: SxProps;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SearchInput = ({
  defaultValue,
  className,
  sx,
  onChange,
  onKeyPress,
}: SearchInputProps) => {
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
      <SearchStyledInput
        ref={inputRef}
        placeholder={i18n.t("search.placeholder")}
        onChange={onChange}
        onKeyPress={onKeyPress}
        defaultValue={defaultValue}
      />
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

  const ref = useRef<HTMLAnchorElement>(null);

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
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...sx,
      }}
    >
      <a
        href={href}
        ref={ref}
        onClick={(e) => {
          if (href) {
            e.preventDefault();

            if (!children || (children && isOpen)) {
              navigate(href);
            }
          }
          setIsOpen(!isOpen);
        }}
      >
        <HeaderTypography>
          {title}

          {children && <CaratDown style={{ marginLeft: "0.5rem" }} />}
        </HeaderTypography>
      </a>

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
}));

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as any).navigate = navigate;
    }
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
        minHeight: 85,
        position: "sticky",
        top: 0,
        zIndex: 100,
        "& .non-mobile-hide": {
          display: "none",
        },
        "@media (max-width: 1200px)": {
          "& .mobile-toggle": {
            display: isMobileMenuOpen ? "flex" : "none",
          },
          "& .mobile-toggle-inverse": {
            display: isMobileMenuOpen ? "none" : "flex",
          },

          "& .non-mobile-hide": {
            display: "flex",
          },
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "1rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",

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
            minHeight: 48,

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
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
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
            <Box className="mobile-toggle" sx={{ width: "36px" }} />
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
            title={i18n.t("header.menuitem.home")}
            href="/"
            sx={{
              marginLeft: "1.5rem",
              "@media (max-width: 1200px)": {
                marginLeft: 0,
              },
            }}
          />
          {/*<MenuItem title="About" href="/about" />*/}
          {/*<MenuItem title="Education" href="/education" />*/}
          <MenuItem
            title={i18n.t("header.menuitem.resources")}
            href="/resources"
          >
            <Menu>
              {tags.map((tag, i) => (
                <a
                  href={`/resources?tags=${tag.value}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/resources?tags=${tag.value}`);
                  }}
                >
                  {i18n.t(`tags.${tag.value}`)}
                </a>
              ))}
            </Menu>
          </MenuItem>
        </Box>
        {location.pathname !== "/resources" && (
          <SearchInput
            className="mobile-toggle"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                navigate(`/resources?search=${e.currentTarget.value}`);
              }
            }}
            sx={{
              marginLeft: "0.5rem",
            }}
          />
        )}
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
          {i18n.t("header.emergency-exit")}
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
