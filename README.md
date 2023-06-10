# round-tracker

A Round Tracker for Foundry VTT.

# Release

## To perform a release:

1. Tag the clean, current master with a version number in semver format (e.g. `v1.0.0`)
   1. Make sure to tag the version the same version as is present in package.json. This is the version that will be used by Foundry VTT to determine if an update is available.
1. Push the tag to GitHub
   1. This will trigger a GitHub Action that will build the release and upload it to the GitHub release page.
1. Bump the revision number in package.json to the next patch version (e.g. `1.0.1`) and push that to master.

## Improvements

1. Automatically bump the version number in package.json when a release is made without having to manually edit the file. The problem is right now is that npm version creates a version tag allong with commiting the package.json file.
