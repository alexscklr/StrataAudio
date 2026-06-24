This directory contains Changesets markdown files that describe versioned changes for @strata/video-multitrack-player.

Typical workflow:
1. Run `npm run changeset` and describe your change.
2. Commit the generated `.changeset/*.md` file.
3. On release, run `npm run version-package` to apply version/changelog updates.
4. Publish with `npm run release-package`.
