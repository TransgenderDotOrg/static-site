import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import GoogleMapReact from "google-map-react";
import { Autocomplete, Box, Menu, Typography } from "@mui/material";
import { Resource } from "./resource";
import i18n from "../i18n";
import languages from "../../languages.json";
import { ReactComponent as MarkerIcon } from "../assets/marker.svg";
import { Link } from "../ui/link";

const mapStyles = {
  width: "100%",
  height: "100%",
};

export interface MarkerProps {
  lat: number;
  lng: number;
  resource: Resource;
}

export const Marker = (props: MarkerProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | Element>(null);

  return (
    <div style={{ position: "relative" }}>
      <MarkerIcon
        onClick={(e) => setAnchorEl(e.currentTarget)}
        style={{
          position: "absolute",
          bottom: 0,
          left: "calc(50% - 10px)",
          cursor: "pointer",
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          sx: {
            padding: "0.5rem",
          },
        }}
        slotProps={{
          root: {
            sx: {
              padding: 0,
            },
          },
          paper: {
            sx: {
              width: "300px",
            },
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{ fontSize: "0.65rem" }}
          fontWeight={500}
        >
          {props.resource.externalUrl ? (
            <Link href={props.resource.externalUrl}>
              {props.resource.title}
            </Link>
          ) : (
            props.resource.title
          )}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "0.65rem", marginTop: "0.25rem" }}
        >
          {props.resource.description}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          sx={{ fontSize: "0.65rem", marginTop: "0.5rem" }}
        >
          Contact
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "0.65rem", marginTop: "0.25rem" }}
        >
          <div
            itemProp="address"
            itemScope
            itemType="http://schema.org/PostalAddress"
          >
            {props.resource.address}
          </div>
        </Typography>
        {props.resource.phoneNumber && (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.65rem", marginTop: "0.25rem" }}
          >
            <Link
              href={`tel:${props.resource.phoneNumber}`}
              itemProp="telephone"
            >
              {props.resource.phoneNumber}
            </Link>
          </Typography>
        )}
        {props.resource.email && (
          <Typography
            variant="body1"
            sx={{ fontSize: "0.65rem", marginTop: "0.25rem" }}
          >
            <Link href={`mailto:${props.resource.email}`} itemProp="email">
              {props.resource.email}
            </Link>
          </Typography>
        )}
      </Menu>
    </div>
  );
};

export const MapPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [resources, setResources] = React.useState<Resource[]>([]);

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
    };

    void fetchResources();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 85px)",
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCr3rCOGUpIhLLcmGpWOOhmpVkRWrkqbUQ" }}
        center={{
          lat: 0,
          lng: 0,
        }}
        defaultZoom={1}
      >
        {resources
          .filter((resource) => resource.latLng)
          .map((resource, i) => (
            <Marker
              key={i}
              lat={resource.latLng[0]}
              lng={resource.latLng[1]}
              resource={resource}
            />
          ))}
      </GoogleMapReact>
    </Box>
  );
};
