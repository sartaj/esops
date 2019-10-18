First of all, thank you for contributing. It’s appreciated.

# Set up project

`npm i -g esops`
`git clone https://github.com/sartaj/esops.git`
`esops`
`npm i`

You are good to go to develop.

`npm test` is for unit and integration tests
`npm test:e2e` is for visual checks on console logs

# To submit a pull request

1. Open a GitHub issue before doing significant amount of work.
2. Clone the repo. If it was already cloned, then git pull to get the latest from master.
3. Run `npm install`.
4. Write code.
5. Run `npm test` to lint and test. Don’t commit before fixing all errors and warnings.
6. Commit using `npm run commit` and follow the CLI instructions.
7. Make a pull request.

# To release new versions

1. Check that you have npm publishing rights before anything else.
2. Run `npm run check-release`.
3. Run `npm run release`.
