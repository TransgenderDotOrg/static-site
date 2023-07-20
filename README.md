# Transgender.org Static Site

Welcome to the repository for the Transgender.org static site. This project aims to maintain a low-cost, lightweight static site, taking advantage of GitHub Pages to host a single-page web application built with React and Typescript.

## Project Status

This project is currently under active development. It may serve as a temporary solution, exist in continuity, or act as a backup in case of service disruptions or system compromises.

## Getting Started

Before contributing to this project, please ensure that you are using Node.js v18.15.0 and NPM.

### Installation

First, install the project dependencies by running the following command:

```bash
npm install
```

Run the following command to generate local SSL certs:

```bash
npm run install:certs
```

Once completed install the certs and always trust them. This step is OS dependent, follow a tutorial for installing local SSL scripts accordingly.

### Development

To start the project in development mode, run:

```bash
npm run start
```

This command enables Hot Module Replacement (HMR), which can be useful during development.

### Building

Before finalizing a commit, make sure to build the project by running:

```bash
npm run build
```

This command ensures that your changes are included in the build for GitHub Pages to access the assets.

## Contribution Guidelines

We welcome and appreciate your contributions! To contribute:

1. Create a new branch for your feature or bug fix
2. Make your changes
3. Submit a Pull Request (PR)

Please note that for a PR to be approved, it must be verified by two senior developers. Be sure to use the provided PR template when submitting your PRs - this template will auto-populate your pull requests to guide you in providing the necessary information.

We value your input and look forward to your contributions in making www.transgender.org accessible and supportive for everyone. Thank you for being part of our project!

## Scripts

- `scan-website.ts` - This take a URL as an input and attempts to extract as much of the relevant information as possible. This will create a new file in the "intake" directory.
- `process-intake.ts` - This takes the files from the intake directory and creates "resources" with translations for all languages supported.
- `convert-resources.ts` - This takes the data in the "resources" directory and generates flat language specific files to be utilized in the project. These files live in "src/resources" and are generated off the fully processed resources.

## External Content Intake Instructions

1. Create a new base intake file by running the `scan-website` command. You can do this via `npm run scan-website <url>`. You need an OpenAI key present in the `OPENAI_API_KEY` environment variable. You also need a Google Maps key in the `GOOGLE_MAPS_API_KEY` environment variable.
2. Proof-read the newly generated file in the "intake" directory. Ensure the content is correct and be sure to add and content that is missing.
3. Run `npm run process-intake`, if `process-intake` fails you will need to cleanup the intake file in the "processed" folder. Generally, it will rarely fail and it will tell you which languages failed as well as the failed output. You can usually copy this into the output resource file and patch the issue manually.
4. Proofread the file in the "resource" directory.
5. Optionally, run `npm run convert-resources` to add it to the project. This currently happens with every build command.
