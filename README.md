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
* `scan-websites.ts` - This take a URL as an input and attempts to extract as much of the relevant information as possible.
* `convert-resources.ts` - This takes the data produced by `scan-websites.ts` and generates the translations for all of our supported languages.
* `process-intake.ts` - This takes the intake file created with all of the translations for the supported languages and gets them ready for the website and puts them in the processed folder.

## External Content Intake Instructions
1. Go to the new post in #submitted-resources.
2. Copy the external-url off the post.
3. Run `scan-websites.ts` command which creates base file in the `intake` directory.
4. Find the new file if it doesn't have content from the submission then fill in the content from the submission.
5. Give the submission a checkmark in #submitted-resources.
6. Proofread the file one last time and make any necessary changes, if large sections of the file are not suitable then regenerate the file by re-running `scan-websites.ts`.
6. Run `convert-resources.ts`
7. Run `process-intake.ts`, if `process-intake.ts` fails you will need to cleanup the intake file in the "processed" folder.
8. `git add .`
9. `git commit -m "<comment about what you did>"`
10. `git push`