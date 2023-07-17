import {
  AddressType,
  Client as GoogleMapsClient,
} from "@googlemaps/google-maps-services-js";
import puppeteer from "puppeteer";
import fs from "fs";
import { v4 } from "uuid";
import { promisify } from "util";
import { PromptTemplate } from "langchain/prompts";
import { OpenAI } from "langchain/llms/openai";
import path from "path";
import { fileURLToPath } from "url";

import languages from "../languages.json";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const googleMapsClient = new GoogleMapsClient({});

// Promisify fs methods for async/await usage
const writeFile = promisify(fs.writeFile);

const INPUT_DIR = path.join(__dirname, "../intake");

const model = new OpenAI({ modelName: "gpt-4" });
const template = `{content}

The above content was extracted from {url}. Convert the content into a JSON object. Here is the id of the content: {uuid}. Please wrap the output in triple backticks. Use null when you cannot fill a field. Here is the JSON schema:

\`\`\`
{{
    id: string [required]
    title: string [required] (A short title for the resource)
    description: string [required] (A short description about what the resource is about and how it serves the transgender community)
    slug: string [required] [unique]
    externalUrl: Url
    tags: Tags{{ transmasculine, non-binary, transfeminine, legal, healthcare, mental-health, social-services, youth-services, support-groups, parent-family-resources, partner-resources, community-stories, education-awareness, financial-aid-scholarships, clothing, artists-creators, friendly-businesses, makeup, voice-training, discord-groups }}[]
    address: Address [optional, Google Maps friendly]
    phoneNumber: PhoneNumber [optional]
    country: Country [optional] (two letter country code)
    provinceOrState: ProvinceOrState [optional] (two letter province or state code)
    city: City [optional]
    county: County [optional]
    latLng: LatLng [optional] 
    email: Email [optional]
    socialMedia: {{ yelp: Url, google: Url, ... }} [optional]
}}
\`\`\``;
const translationPrompt = new PromptTemplate({
  template,
  inputVariables: ["url", "content", "uuid"],
});

// get the url from the command line
const url = process.argv[2];

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(url);

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // wait for the page to load
  await page.waitForSelector("body");

  // get the page text content
  // we need to strip css and other stuff from the page
  // so we only get the text
  // we will remove those elements from the page
  const textContent = await page.evaluate(() => {
    const selectors = [
      "script",
      "style",
      "svg",
      "img",
      "iframe",
      "canvas",
      "video",
      "noscript",
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((e) => e.remove());
    });

    const textContent = document.querySelector("body")?.textContent;

    // now we need to remove unncecessary whitespace surrounding and in the text
    // we will use a regex to remove all whitespace
    // except for single spaces

    return textContent?.replace(/\s\s+/g, " ");
  });

  await browser.close();

  // now we need to translate the text content into JSON
  // we will use GPT-4 for this

  const id = v4();

  const input = await translationPrompt.format({
    url,
    content: textContent,
    uuid: id,
  });

  const response = await model.call(input);

  // we need to extract the translated JSON from the response
  // we will use a regex to do this
  // it may have triple backticks around it, with or without json
  let translatedJson = response.match(/```(json)?([\s\S]*)```/)?.[2]?.trim();
  let translatedJsonObject: any;

  if (!translatedJson) {
    try {
      translatedJsonObject = JSON.parse(response.trim());
    } catch (err) {
      console.error(
        `Could not extract translated JSON from response: ${response}`
      );
    }
  } else {
    try {
      translatedJsonObject = JSON.parse(translatedJson);
    } catch (err) {
      console.error(
        `Could not extract translated JSON from response: ${response}`
      );
    }
  }

  // now we need to write the translated JSON to a file
  // we will use the id

  const fileName = `${id}.json`;

  // if an address is provided, let's process it with Google Maps
  if (translatedJsonObject.address) {
    console.log(`Processing address: ${translatedJsonObject.address}...`);

    const address = translatedJsonObject.address;

    const geocodeResponse = await googleMapsClient.geocode({
      params: {
        key: process.env.GOOGLE_MAPS_API_KEY ?? "",
        address: address,
      },
      timeout: 1000,
    });

    if (geocodeResponse.data.status === "OK") {
      const country = geocodeResponse.data.results[0].address_components.find(
        (component) => component.types.includes("country" as AddressType)
      )?.short_name;

      const provinceOrState = geocodeResponse.data.results[0].address_components.find(
        (component) =>
          component.types.includes("administrative_area_level_1" as AddressType)
      )?.short_name;

      const county = geocodeResponse.data.results[0].address_components.find(
        (component) =>
          component.types.includes("administrative_area_level_2" as AddressType)
      )?.short_name;

      const city = geocodeResponse.data.results[0].address_components.find(
        (component) => component.types.includes("locality" as AddressType)
      )?.short_name;

      const town = geocodeResponse.data.results[0].address_components.find(
        (component) => component.types.includes("sublocality" as AddressType)
      )?.short_name;

      const latLng = [
        geocodeResponse.data.results[0].geometry.location.lat,
        geocodeResponse.data.results[0].geometry.location.lng,
      ];

      const address = geocodeResponse.data.results[0].formatted_address;

      translatedJsonObject = {
        ...translatedJsonObject,
        country,
        provinceOrState,
        county,
        city,
        town,
        latLng,
        address,
      };
    }
  }

  await writeFile(
    path.join(INPUT_DIR, fileName),
    JSON.stringify(translatedJsonObject, null, 2)
  );

  console.log(`Wrote ${fileName} to ${INPUT_DIR}`);
})();

export {};
