import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import homeImageUrl from "../assets/home.jpg";
import { Button } from "../ui/button";

export const HomePage = () => {
  const navigate = useNavigate();

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
          height: "calc(100vh - 85px)",
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
        <Typography variant="h3">What is Transgender.org?</Typography>
        <Typography variant="body2">
          Transgender.org is a grassroots movement, by and for the transgender
          community. Our mission is to create a dynamic platform that serves as
          an inclusive resource hub for transgender individuals globally. In our
          early beta stage, we're working towards establishing a 501(c)(3) and a
          501(c)(4) to further expand our outreach and impact. We encourage
          community participation, and everyone is welcome to contribute to our
          resources in our Discord server. This is only the beginning of our
          journey to empower and support transgender people worldwide.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}>
          {/*<Button onClick={() => navigate("/about")}>More About Us</Button>*/}
          <Button
            onClick={() => {
              window.open("https://discord.gg/wtRVNzpGkx", "_blank");
            }}
          >
            Join Us On Discord
          </Button>
          <Button
            onClick={() => navigate("/resources")}
            sx={{ marginLeft: "0.5rem" }}
          >
            Go to Resources
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
