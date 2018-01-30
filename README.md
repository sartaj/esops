# esops

Learn once. Publish everywhere.

Just choose a target and whether you want to `dev` or `ship`.

Where something hasn't been automated, it will try to output documentation on what to do.

## Support

* Web
* Web → GitHub Pages

### Languages

* ESNext JavaScript + Flow
* TypeScript

## Requirements

* Local Node.js
* Yarn

### Requirement Notes

User Interfaces are designed to be built on top of React Native, but don't require it for web and desktop-web.

Node apps (libraries, servers, serverless) are dependency free.

Arduino Apps are designed to use `johnny-five`.

Designed and tested to be used with `yarn`.

## Install

### Globally

```bash
yarn global add esops
```

### Locally

```bash
yarn add esops --dev
```

## Usage

From your package root, run the following:

### Static Web

#### Develop

```bash
esops dev web
esops dev github-pages
```

This will create the development package. It will look for a entry file either via the `package.json` or some common entry files, such as `index.js`, `src/index.js`, etc.

#### Publish

```bash
esops ship github-pages
```

This will attempt to publish to the GitHub Pages of the repo you are on.

## More Info

For more information, check out the [InDepth](InDepth.md) docs.