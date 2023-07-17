import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import GoogleMapReact from "google-map-react";
import { Autocomplete, Box } from "@mui/material";
import { Resource } from "./resource";
import i18n from "../i18n";
import languages from "../../languages.json";

const mapStyles = {
  width: "100%",
  height: "100%",
};

export interface MarkerProps {
  lat: number;
  lng: number;
  text: string;
}

export const Marker = (props: MarkerProps) => <div>{props.text}</div>;

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
              text={resource.title}
            />
          ))}
      </GoogleMapReact>
    </Box>
  );
};
