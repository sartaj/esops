# esops

Learn once. Publish everywhere. 1 `devDependency`.

An attempt to create a single devops package that can create developer environments, build packages, and assist in publishing to any many ecosystems as possible.

User Interfaces are designed to be built on top of React Native, but don't require it for web and desktop-web.

Node apps (libraries, servers, serverless) are dependency free.

Arduino Apps are designed to use `johnny-five`.

Designed and tested to be used with `yarn`.

## Primary Commands

Every command will have two options, `dev`, and `ship`. For example `esops web static dev` and `esops web static ship`.

## Current Capabilities

### Language Support

* ESNext JavaScript + Flow
* TypeScript

### Build

* Static Web (with React Native)
* Desktop Web (with React Native Electron)

### Publish

* Github Pages (automated)

## Prerequisites

* Local Node.js
* Yarn

## Install

### Globally

```bash
yarn global add esops
```

### Locally

```bash
yarn add esops --dev
```

## Commands

From your package root, run the following:

### Static Web

#### Develop

```bash
esops web static dev
```

This will create the development package. It will look for a entry file either via the `package.json` or some common entry files, such as `index.js`, `src/index.js`, etc.

#### Publish

```bash
esops web static ship
```

This will attempt to publish to the GitHub Pages of the repo you are on.

## Roadmap Overview

### Targets

* React Native iOS
* React Native Android
* Node Serverless
* Node Server
* Arduino Compatible Hardware

### Publish

* iOS App Store
* Mac App Store
* Google Play Store
* NPM
* AWS
* IBM
