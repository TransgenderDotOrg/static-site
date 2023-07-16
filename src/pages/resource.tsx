import React from "react";
import { useSearchParams } from "react-router-dom";
import * as acceptLanguage from "accept-language-parser";

import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { ReactComponent as ResultsLeft } from "../assets/results-left.svg";
import { ReactComponent as ResultsRight } from "../assets/results-right.svg";
import tags from "../../tags.json";
import languages from "../../languages.json";

import { SearchInput } from "../ui/navigation/header";
import useSearch from "../hooks/useSearch";

interface Resource {
  id: string;
  slug: string;
  externalUrl: string;
  tags: string[];
  title: string;
  description: string;
}

export const ResourcePage = () => {
  const [isLoadingResources, setIsLoadingResources] = React.useState(true);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const queryTags = React.useMemo(
    () =>
      decodeURIComponent(searchParams.get("tags") ?? "")
        .split(",")
        .filter(Boolean) ?? [],
    [searchParams]
  );

  const language = React.useMemo(
    () =>
      acceptLanguage.pick(
        [...languages, { language: "English", locale_code: "en" }].map(
          (language) => language.locale_code.split("-")[0]
        ),
        navigator.languages.map((language) => ({ code: language, quality: 1 }))
      ),
    []
  );

  console.log(
    navigator.languages,
    [...languages, { language: "English", locale_code: "en" }].map(
      (language) => language.locale_code.split("-")[0]
    )
  );

  React.useEffect(() => {
    const fetchResources = async () => {
      const pickedLanguage = languages.find(
        (l) => l.locale_code.split("-")[0] === language
      );

      const { default: resources } = await import(
        `../resources/${pickedLanguage?.locale_code}.json`
      );

      const resourcesArray: Resource[] = Object.values(resources);

      setResources(resourcesArray);
      setIsLoadingResources(false);
    };

    void fetchResources();
  }, [language]);

  const { results, searchValue, setSearchValue } = useSearch<Resource>({
    defaultValue: searchParams.get("search") ?? "",
    dataSet: resources,
    keys: ["title", "description", "externalUrl"],
  });

  const resultsWithTagsFiltered = React.useMemo(
    () =>
      results.filter((result) =>
        queryTags.every((tag) => result.tags.includes(tag))
      ),
    [results, queryTags]
  );

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h3">Resources</Typography>
      <Typography variant="body2">
        Empowering Information at your fingertips - Discover, explore, and
        access an extensive collection of resources designed to support,
        educate, and uplift the transgender community.
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
                  checked={queryTags.includes(tag.value)}
                  onChange={(e) => {
                    const newQueryTags = queryTags.includes(tag.value)
                      ? queryTags.filter((t) => t !== tag.value)
                      : [...queryTags, tag.value];

                    const newQueryTagsString = newQueryTags.join(",");

                    if (newQueryTagsString) {
                      searchParams.set("tags", newQueryTagsString);
                    } else {
                      searchParams.delete("tags");
                    }

                    setSearchParams(searchParams);
                  }}
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
          <SearchInput
            sx={{ width: "100%" }}
            onChange={(e) => {
              if (!e.target.value) {
                searchParams.delete("search");
              } else {
                searchParams.set("search", e.target.value);
              }
              setSearchParams(searchParams);
              setSearchValue(e.target.value);
            }}
            defaultValue={searchValue}
          />
          <Typography variant="body1" sx={{ marginTop: "1rem" }}>
            {resultsWithTagsFiltered.length} Results
          </Typography>
          {resultsWithTagsFiltered.map((result, i) => (
            <Box key={i} sx={{ marginTop: "1rem" }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Mukta, sans-serif",
                  textDecoration: "underline",
                  color: "#0D6EFD",
                  cursor: "pointer",
                }}
              >
                <a href={result.externalUrl} target="_blank">
                  {result.title}
                </a>
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                {result.description}
              </Typography>
            </Box>
          ))}
          {/*<Box
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
            </Box>*/}
        </Box>
      </Box>
    </Box>
  );
};