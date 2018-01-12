# esops

Cross platform JavaScript Devops through a CLI. The goal is for you to be able to learn as little as possible and maximize how many different kinds of products you can ship in a (mostly) professional manner.

Designed for startups, learners, and coders who prefer to not think about DevOps but want code to certain standards.

# Primary Learning Curves

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

* API (Node + Docker)
* Isomorphic App (Node + Docker + React Native Web)
* Serverless (Node)
* iOS (via React Native)
* Android (via React Native)
* Static Site (React Native-Web)
* Desktop Web Mac/Windows/Linux (Using React Native Web + Electron)
* Native MacOS (Using React Native MacOS)
* Arduino (Using Johnny-Five)

### Out of the box Multi Language Support

* ESNext (with babel-env + Spread Operators + Async/Await)
* Flow
* TypeScript
* Elm

### Developer Experience

* A CLI that strives to suggest what to do/learn over just provide an error. When any tasks are needed to complete that the CLI can't do, it strives to provide suggestions.
* Keep the CLI beginner/startup friendly. Provide wizards and errors that can go into wizard mode.
* Support primary Developer Experience flow of init, edit, debug, and ship. When scripts can't do it, Provide suggestions and best practice.
* Allow for default and easy path configs.

### Bare Minimal Code Scaffolding

We want to minimize codebase polluting as much as possible. Esops justs want to be your devDependencies and minimal dependencies for cross platform development.

### Code Quality Helpers

Configure everything below based on target, language choice, user preference, & popular configs, in that order.

* Linting
* Code Editor Integration
* Continuous Integration
* Dependency auto-add/install/update
* Testing
* Documentation, Readmes, and Readme Badges
* Publishing to marketplaces, cloud, etc
* Version management
* Asset Management (CDN Generation, App Store Submission Icons)

#### Static Analysis

* Complexity
* Coverage
* Code Linting
* Spellcheck
* Types (Flow)

#### IDE Integrations

* To make sure things like static analysis are integrated properly for the ecosystem.

#### Tests/Specs

#### Documentation

* Code walkthrough documents
* Readme Documentation

#### Continious Integration

### Making it Live

* For all targets, esops strives to provide the quickest path to having something actually live.

* Android App Store (via fastlane)
* iOS App Store (via fastlane)
* Serverless Clouds (via serverless app)

## Your Main Options

## Separate Target Specifc Code (default `true` for most targets)

```javscript
App.ios.ts
App.android.js.flow
App.web.elm
App.node.js
App.arduino.js
App.browserextension.js
```

## React Native Base (default `true` for any targets featuring a UI)

Yes, you can use Vue.js, Angular, or anything else you'd like, but we encourage you to remain compatible with React Native if doing UI work as it'll allow for easier cross-platform code sharing.

## Packages Roadmap

* @esops/compiler-babel
* @esops/compiler-react-native
* @esops/compiler-babel-native-web
* @esops/compiler-react-native-electron
* @esops/compiler-serverless
* @esops/compiler-typescript
* @esops/docs-badges
* @esops/docs-groc
* @esops/docs-instanbul
* @esops/docs-plato
* @esops/docs-readme
* @esops/editor-atom
* @esops/editor-vscode
* @esops/cli
- [esops](#esops)
- [Primary Learning Curves](#primary-learning-curves)
    - [Features](#features)
        - [Validate, Compile, Test, Document, & Publish multiple types of javascript-based products from 1 `devDependency`](#validate-compile-test-document-publish-multiple-types-of-javascript-based-products-from-1-devdependency)
        - [1 `devDependency`, Multiple Platforms](#1-devdependency-multiple-platforms)
        - [Out of the box Multi Language Support](#out-of-the-box-multi-language-support)
        - [Developer Experience](#developer-experience)
        - [Bare Minimal Code Scaffolding](#bare-minimal-code-scaffolding)
        - [Code Quality Helpers](#code-quality-helpers)
            - [Static Analysis](#static-analysis)
            - [IDE Integrations](#ide-integrations)
            - [Tests/Specs](#testsspecs)
            - [Documentation](#documentation)
            - [Continious Integration](#continious-integration)
        - [Making it Live](#making-it-live)
    - [Your Main Options](#your-main-options)
    - [Separate Target Specifc Code (default `true` for most targets)](#separate-target-specifc-code-default-true-for-most-targets)
    - [React Native Base (default `true` for any targets featuring a UI)](#react-native-base-default-true-for-any-targets-featuring-a-ui)
    - [Packages Roadmap](#packages-roadmap)
