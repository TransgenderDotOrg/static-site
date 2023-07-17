## Requirements
1. Run through the setup process in README.md.

## Instructions
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