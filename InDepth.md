# esops - In Depth

Cross platform JavaScript Devops through a CLI. The goal is for you to be able to learn as little as possible and maximize how many different kinds of products you can ship in a (mostly) professional manner.

Designed for startups, learners, and coders who prefer to not think about DevOps but want code to certain standards.

## Primary Learning Curves

* Git
* CSS + CSS in JS
* HTML + JSX
* ES6 JavaScript
* React.js Design Patterns
* Async Management (through user preferred system)
* State Management (through user preferred system)

## Features

### Validate, Compile, Test, Document, & Publish multiple types of javascript-based products from 1 `devDependency`

By leveraging great tools already created, esops helps you choose the kind of product you want, the language you prefer, and the places you want to publish it, and it creates the appropriate configuration to help with the release flow of "validate, compile, test, document, & publish"

### 1 `devDependency`, Multiple Platforms

Ship multiple types of language-agnostic JS Apps based on production guidelines.

### No runtime dependencies

Esops justs want to be a devDependency. For more scaffolding specific assistance related to React Native, check esops inspiration, Ignite

## Roadmap

*Backlog* 🗄 → *In Progress* ⏳ → *Testing* 🔬 → *Live* ✅ 

### Language Support

* ESNext JavaScript + Flow ✅
* TypeScript 🔬
* Elm 🗄

### Shipping Methods

* React Native Web -> GitHub Pages ✅
* React Native Web Electron -> Mac App Store ⏳
* React Native Web Electron -> Windows Store ⏳
* React Native iOS -> iOS App Store 🗄
* React Native Android -> Google Play 🗄
* ECMAScript Targeted Library -> npm
* Node Serverless -> ? 🗄
* Node Server -> ? 🗄
* Arduino Compatible Hardware -> ? 🗄

### Dev Ops Tools

* Linting Setup Assistance (per-language analysis) 🗄
* CI Assistance (travis-ci) 🗄
* Pipeline/Git Stages Assistance 🗄
* Documentation/Communications Assistance 🗄
* Test Framework Setup Assistance 🗄
* Asset Management Assistance 🗄
* Code Editor Setup Assistance 🗄
* Debug Setup Assistance 🗄
* Static Analysis (Complexity, Coverage

## General Good Practice Within esops

### File Naming (to help clearly separate environments)

### Separate Target Specifc Code (default `true` for most targets)

```javscript
App.ios.ts
App.android.js.flow
App.web.elm
App.web.dev.elm
App.node.js
App.arduino.js
App.browserextension.js
```

### React Native Base (default `true` for any targets featuring a UI)

Yes, you can use Vue.js, Angular, or anything else you'd like, but we encourage you to remain compatible with React Native if doing UI work as it'll allow for easier cross-platform code sharing.