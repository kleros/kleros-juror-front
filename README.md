<p align="center">
  <b style="font-size: 32px;">Kleros Juror Front</b>
</p>

<p align="center">
  <a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="JavaScript Style Guide"></a>
  <a href="https://travis-ci.org/kleros/kleros-juror-front"><img src="https://travis-ci.org/kleros/kleros-juror-front.svg?branch=master" alt="Build Status"></a>
  <a href="https://david-dm.org/kleros/kleros-dapp-boilerplate"><img src="https://david-dm.org/kleros/kleros-juror-front.svg" alt="Dependencies"></a>
  <a href="https://david-dm.org/kleros/kleros-dapp-boilerplate?type=dev"><img src="https://david-dm.org/kleros/kleros-dapp-boilerplate/dev-status.svg" alt="Dev Dependencies"></a>
  <a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest"></a>
  <a href="https://coveralls.io/github/kleros/kleros-juror-front?branch=master"><img src="https://coveralls.io/repos/github/kleros/kleros-juror-front/badge.svg?branch=master" alt="Coverage Status"></a>
  <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Conventional Commits"></a>
  <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="Styled with Prettier"></a>
</p>

## Get Started

1. Clone this repo.
2. Install and set up the [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) chrome extension.
3. Run `yarn` to install dependencies and then `yarn start` to start the dev server.

## Other Scripts

* `yarn run prettify` - Applies prettier to the entire project.
* `yarn run lint` - Lints the entire project.
* `yarn run lint:fix` - Fixes fixable linting errors.
* `yarn test` - Runs the jest test suites + storyshots.
* `yarn run storybook` - Starts the storybook.
* `yarn run cz` - Runs commitizen.
* `yarn run build` - Creates a production build.
* `yarn run build:analyze` - Analyzes the production build using source-map-explorer.

## Testing

Storybook Storyshots for `components` and jest integration tests for `containers`.
