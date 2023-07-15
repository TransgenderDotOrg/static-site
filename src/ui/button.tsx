import React from "react";

import { Box, SxProps, Typography, styled, useTheme } from "@mui/material";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps;
}

export const Button = ({ children, onClick, sx }: ButtonProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginLeft: "0.5rem",
        padding: "0.5rem 0.75rem",
        background: "#FF8787",
        fontFamily: "Mukta, sans-serif",
        color: "#21242B",
        borderRadius: "24px",
        cursor: "pointer",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
