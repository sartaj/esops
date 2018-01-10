# esops

Learn once. Publish everywhere.

An attempt to create a single devops packages that can publish to any many ecosystems as possible. Built on top of React Native.

## Current Capabilities

### Languages

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

### Install

```bash
yarn global add esops
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
