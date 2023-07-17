import React from "react";
import { useSearchParams } from "react-router-dom";

import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { ReactComponent as ResultsLeft } from "../assets/results-left.svg";
import { ReactComponent as ResultsRight } from "../assets/results-right.svg";
import tags from "../../tags.json";
import languages from "../../languages.json";

import { SearchInput } from "../ui/navigation/header";
import useSearch from "../hooks/useSearch";
import i18n from "../i18n";
import { usePagination } from "../hooks/usePagination";

export interface Resource {
  id: string;
  slug: string;
  externalUrl: string;
  tags: string[];
  title: string;
  description: string;
  latLng: [number, number];
}

export interface PaginatorPageProps {
  currentPage: number;
  offset: number;
  maxPage: number;
  setPage: (page: number) => void;
}

export const PaginatorPage = ({
  currentPage,
  offset,
  maxPage,
  setPage,
}: PaginatorPageProps) => {
  const page =
    currentPage < 3
      ? currentPage + offset - (currentPage - 1)
      : currentPage + offset - 2;

  return (
    <Box
      onClick={() => {
        if (page === currentPage || page > maxPage) {
          return;
        }

        setPage(page);
      }}
      sx={{
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        cursor:
          page === currentPage
            ? "not-allowed"
            : page > maxPage
            ? "unset"
            : "pointer",
      }}
    >
      {page <= maxPage && (
        <Typography
          variant="body1"
          sx={{ color: page === currentPage ? "#666666" : "#0D6EFD" }}
        >
          {page}
        </Typography>
      )}
    </Box>
  );
};

export const ResourcePage = () => {
  const [isLoadingResources, setIsLoadingResources] = React.useState(true);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const queryTags = React.useMemo(
    () =>
      decodeURIComponent(searchParams.get("tags") ?? "")
        .split(",")
        .filter(Boolean) ?? [],
    [searchParams.get("tags")]
  );

  React.useEffect(() => {
    const fetchResources = async () => {
      const pickedLanguage = [...languages, { locale_code: "en-US" }].find(
        (l) => l.locale_code === i18n.language
      );

      const { default: resources } = await import(
        `../resources/${pickedLanguage?.locale_code}.json`
      );

      const resourcesArray: Resource[] = Object.values(resources);

      setResources(resourcesArray);
      setIsLoadingResources(false);
    };

    void fetchResources();
  }, []);

  const { results, searchValue, setSearchValue } = useSearch<Resource>({
    defaultValue: searchParams.get("search") ?? "",
    dataSet: resources,
    keys: ["title", "description", "externalUrl"],
  });

  const filteredResources = React.useMemo(
    () =>
      results.filter((result) =>
        queryTags.every((tag) => result.tags.includes(tag))
      ),
    [results, queryTags]
  );

  const pageString = searchParams.get("page");

  const {
    canNavigateNext,
    canNavigatePrev,
    currentPage,
    currentPageData,
    maxPage,
    nextPage,
    prevPage,
    setPage,
  } = usePagination<Resource>(
    filteredResources,
    20,
    pageString ? parseInt(pageString, 10) : 1
  );

  React.useEffect(() => {
    // reset page when search value changes or query tags change
    setPage(1);
  }, [searchValue, queryTags]);

  React.useEffect(() => {
    // update page query param when page changes and not the first page
    if (currentPage > 1) {
      searchParams.set("page", currentPage.toString());

      setSearchParams(searchParams);
    } else {
      searchParams.delete("page");

      setSearchParams(searchParams);
    }
  }, [currentPage]);

  React.useEffect(() => {
    if (pageString) {
      const parsedPage = parseInt(pageString, 10);

      setPage(parsedPage);
    }
  }, [pageString]);

  const setPageAndScroll = (page: number) => {
    setPage(page);

    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h3">
        {i18n.t("header.menuitem.resources")}
      </Typography>
      <Typography variant="body2">{i18n.t("resources.description")}</Typography>
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
          <Box
            sx={{
              width: 200,
              border: `2px solid #D6D6D6`,
              "@media (max-width: 768px)": {
                width: "unset",
              },
            }}
          >
            <Box
              sx={{ padding: "0.5rem 1rem", borderBottom: `2px solid #D6D6D6` }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "Mukta, sans-serif",
                }}
              >
                {i18n.t("tags")}
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
                    <Typography
                      variant="body1"
                      sx={{ marginLeft: "0.25rem", wordBreak: "break-word" }}
                    >
                      {i18n.t(`tags.${tag.value}`)}
                    </Typography>
                  }
                  sx={{ marginLeft: "0.15rem", flex: 1 }}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          ref={resultsRef}
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
            sx={{ width: "auto" }}
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
            {currentPageData.length} {i18n.t("resources.results")}
          </Typography>
          {currentPageData.map((result, i) => (
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
          <Box
            sx={{ display: "flex", flexDirection: "row", marginTop: "1rem" }}
          >
            <Box
              onClick={() => {
                if (!canNavigatePrev) return;

                prevPage();
                resultsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: canNavigatePrev ? "pointer" : "not-allowed",

                "& path": {
                  fill: canNavigatePrev ? "#0D6EFD" : "#666666",
                },
              }}
            >
              <ResultsLeft />
            </Box>
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={0}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={1}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={2}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={3}
            />
            <PaginatorPage
              currentPage={currentPage}
              setPage={setPageAndScroll}
              maxPage={maxPage}
              offset={4}
            />
            <Box
              onClick={() => {
                if (!canNavigateNext) return;

                nextPage();
                resultsRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              sx={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                cursor: canNavigateNext ? "pointer" : "not-allowed",

                "& path": {
                  fill: canNavigateNext ? "#0D6EFD" : "#666666",
                },
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
              {(currentPage - 1) * 20 + 1}-
              {(currentPage - 1) * 20 + currentPageData.length} of{" "}
              {filteredResources.length}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
