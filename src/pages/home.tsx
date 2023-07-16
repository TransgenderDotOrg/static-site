import React from "react";
import { Box, Typography } from "@mui/material";

import homeImageUrl from "../assets/home.jpg";
import { Button } from "../ui/button";

export const HomePage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%), url(${homeImageUrl}) no-repeat center center`,
        backgroundSize: "cover",
        height: "calc(100vh - 85px - 200px)",
        padding: "100px 120px",

        "@media (max-width: 768px)": {
          padding: 0,
          justifyContent: "flex-end",
          background: `url(${homeImageUrl}) no-repeat center center`,
        },
      }}
    >
      <Box
        sx={{
          borderRadius: "8px",
          background: "#fff",
          width: 500,
          padding: "1rem 2rem",

          "@media (max-width: 768px)": {
            width: "unset",
            borderRadius: 0,
          },
        }}
      >
        <Typography variant="h3">What do we do?</Typography>
        <Typography variant="body1">
          Dorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
          turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec
          fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus
          elit sed risus. Maecenas eget condimentum velit, sit amet feugiat
          lectus. Class aptent taciti sociosqu ad litora torquent per conubia
          nostra, per inceptos himenaeos. Praesent auctor purus luctus enim
          egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex.
          Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum
          lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in
          elementum tellus.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}>
          <Button>More About Us</Button>
          <Button sx={{ marginLeft: "0.5rem" }}>Go to Resources</Button>
        </Box>
      </Box>
    </Box>
  );
};
