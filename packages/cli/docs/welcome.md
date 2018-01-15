![esops](/Users/sartaj/clients/sartaj/esops/packages/logger/components/carlton.gif)

# esops

Learn once. Publish everywhere.

Just choose a target and whether you want to `dev` or `ship`.

Where something hasn't been automated, it will try to output documentation on what to do.

## Support

### Targets

* Static Web App

### Publishers

* GitHub Pages

### Languages

* ESNext JavaScript + Flow
* TypeScript

## Requirements

* Local Node.js
* Yarn

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
esops web static dev
```

This will create the development package. It will look for a entry file either via the `package.json` or some common entry files, such as `index.js`, `src/index.js`, etc.

#### Publish

```bash
esops web static ship
```

This will attempt to publish to the GitHub Pages of the repo you are on.

## Roadmap

*Backlog* 🗄 → *In Progress* ⏳ → *Testing* 🔬 → *Live* ✅ 

### Targets

* React Native Web ✅
* React Native Desktop ⏳
* React Native iOS 🗄
* React Native Android 🗄
* Node Serverless 🗄
* Node Server 🗄
* Arduino Compatible Hardware 🗄

### Publishers

* GitHub Pages ✅
* iOS App Store 🗄
* Mac App Store 🗄
* Google Play Store 🗄
* NPM 🗄
* AWS 🗄
* IBM 🗄

### Languages

* ESNext JavaScript + Flow ✅
* TypeScript 🔬
* Elm 🗄

### Dev Ops Tools

* Linting Setup Assistance 🗄
* CI Assistance 🗄
* Pipeline/Git Assistance 🗄
