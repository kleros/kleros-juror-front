*Please consult https://github.com/kleros/kleros.md/blob/master/quality-management/contributing.md for kleros-wide contributing guidelines!*

# Contributing Guidelines

Hi! Thanks for contributing! This document specifies some general rules and processes for contributors to this project! Woot!

## Developer's guide

To contribute, please **fork** the repo of your choice and then submit a pull request against the `development` branch of the repo you're improving!

In general, you will need to setup [yarn](https://yarnpkg.com/en/), configure a `.env` file, and pass in a Coveralls repo token into `.coveralls.yml`.

Configuration documentation will also be available in each repository.
[https://coveralls.io/](https://coveralls.io/)

## How to contribute

If you'd like to contribute to kleros, please fork the repo, fix, commit and send a pull request against the `development` branch for the maintainers to review and merge into the main code base. If you wish to submit more complex changes though, please check up with a core dev first on [our gitter channel](https://gitter.im/kleros/Lobby) or  in the `#dev` channel on our [slack](https://kleros.slack.com/) to ensure those changes are in line with the general philosophy of the project and/or to get some early feedback which can make both your efforts easier as well as our review and merge procedures quick and simple.

We encourage a “PR early” approach so create the PR as early as possible even without the fix/feature ready, so that devs and other volunteers know you have picked up the issue. These early PRs should indicate an 'in progress' status by adding the '[WIP]' prefix to the PR title. Please make sure your contributions adhere to our coding guidelines:

* Pull requests adding features or refactoring should be opened against the `development` branch
* Pull requests fixing bugs in the latest release version should be opened again the `master` branch
* Write [good commit messages](https://chris.beams.io/posts/git-commit/) - we also use [commitizen](https://github.com/commitizen/cz-cli)

### Commit guidelines

Steps to take after forking:
```
git checkout -b feature/...
git checkout -b fix/...
```

We ask that you please write [good commit messages](https://chris.beams.io/posts/git-commit/) - we also use [commitizen](https://github.com/commitizen/cz-cli) - e.g.:

```
[ADD] new file/fonction/feature
[UPD] update file/fontion/feature
[UPG] upgrade dependency
[ARC] refactor part of the project
[DEL] remove file/fonction/feature
[WIP] work in progress
```

Then, when you're ready to submit a Pull Request, please submit it against the `development` branch!

## Code quality

Because kleros is used by multiple relayers in production and their businesses depend on it, we strive for excellent code quality. Please follow the existing code standards and conventions. `standardjs` will help you.
If you're adding functionality, please also add tests and make sure they pass. We have an automatic coverage reporting tool, so we'll see it if they are missing ;)

All commits that are submitted will run through a pre-commit testing and validation process to help ensure commit quality and codebase integrity according to the specified conventions above!

Additional code coverage and testing tools like [Coveralls](https://coveralls.io/) are also used so. For answers to any questions regarding code quality standards, please review the individual repo docs and feel free to ask questions through our Slack channel (details below)!

## Branch structure & versioning

We use [semantic versioning](http://semver.org/), but before we reach v1.0.0 all breaking changes as well as new features will be minor version bumps.

We have two main branches: `master` and `develop`.

`master` represents the most recent released (published on npm) version.

`development` represents the development state and is a default branch to which you will submit a PR. We use this structure so that we can push hotfixes to the currently released version without needing to publish all the changes made towards the next release. If a hotfix is implemented on `master`, it is back-ported to `develop`.

Please document all non-minor changes you make to `CHANGELOG.md` which is available in each respective project root.

Please update version changes in `package.json`.

## Slack Channel

Please make suggestions, request guidance, and introduce yourself at https://kleros.slack.com/!