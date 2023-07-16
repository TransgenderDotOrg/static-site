import React from "react";
import * as acceptLanguage from "accept-language-parser";

import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { ReactComponent as ResultsLeft } from "../assets/results-left.svg";
import { ReactComponent as ResultsRight } from "../assets/results-right.svg";
import tags from "../../tags.json";
import languages from "../../languages.json";

import { SearchInput } from "../ui/navigation/header";

export const ResourcePage = () => {
  const language = React.useMemo(
    () =>
      acceptLanguage.pick(
        [...languages, { language: "English", locale_code: "en-US" }].map(
          (language) => language.locale_code.split("-")[0]
        ),
        navigator.languages.map((language) => ({ code: language, quality: 1 }))
      ),
    []
  );

  console.log(
    language,
    [...languages, { language: "English", locale_code: "en-US" }].map(
      (language) => language.locale_code.split("-")[0]
    ),
    navigator.language
  );

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h3">Resources</Typography>
      <Typography variant="body2">
        Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
        libero et velit interdum, ac aliquet odio mattis.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginTop: "1rem",
          "@media (max-width: 768px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box>
          <Box sx={{ width: 200, border: `2px solid #D6D6D6` }}>
            <Box
              sx={{ padding: "0.5rem 1rem", borderBottom: `2px solid #D6D6D6` }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Mukta, sans-serif",
                }}
              >
                Tags
              </Typography>
            </Box>

            {tags.map((tag) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "0.25rem",
                }}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Typography variant="body1" sx={{ marginLeft: "0.25rem" }}>
                      {tag.name}
                    </Typography>
                  }
                  sx={{ marginLeft: "0.15rem" }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            marginLeft: "1.25rem",
            width: "100%",
            marginRight: "1rem",

            "@media (max-width: 768px)": {
              marginLeft: 0,
              marginTop: "1rem",
            },
          }}
        >
          <SearchInput sx={{ width: "100%" }} />
          <Typography variant="body1" sx={{ marginTop: "1rem" }}>
            20 Results
          </Typography>
          <Box sx={{ marginTop: "1rem" }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Mukta, sans-serif",
                textDecoration: "underline",
                color: "#0D6EFD",
                cursor: "pointer",
              }}
            >
              Resource 1
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
              Dorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis.
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ResultsLeft />
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ color: "#666666" }}>
                1
              </Typography>
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ color: "#0D6EFD" }}>
                2
              </Typography>
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ color: "#0D6EFD" }}>
                3
              </Typography>
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ color: "#0D6EFD" }}>
                4
              </Typography>
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Typography variant="body1" sx={{ color: "#0D6EFD" }}>
                5
              </Typography>
            </Box>
            <Box
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ResultsRight />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginLeft: "1.25rem",
              }}
            >
              1-20 of 120 Results
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
