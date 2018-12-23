# esops - Decoupled Infrastructure

[![Build Status](https://travis-ci.com/sartaj/esops.svg?branch=master)](https://travis-ci.com/sartaj/esops)

Template generation with a twist: automatically add generated files to ignore files.

![ ](https://raw.githubusercontent.com/sartaj/esops/master/assets/esops-demo.gif)

## Benefits

- Decouple your infrastructure by managing codependent config files like `.eslintrc`, `tsconfig.json`, and `.prettierrc` in a separate directory or module.
- Maintain cleaner code bases by reducing number of config files in the root.

## Features

- Generate files in a directory from a template directory.
- If a `.gitignore` exists, automatically update it with a list of generated files.

## Why

There are so many developer tools out there, like `eslint`, `prettier`, and `typescript`, that have codependent config files that have to be available at the root level of project to enable features like code editor integration. The management of these files can be considered a separate concern from your project goal.

By separating these files, and adding them as auto-ignored template files, you can update and manage your infrastructure separately from your client code.

New `eslint` settings? Need to support `prettier` now? Someone on the team wants better `vscode` integration? With `esops`, generated files don't pollute git or npm, thus not having to deal with rebasing or codgen issues that happen with other template generators.

## How to Use

### Install `esops`

Install globally or locally

#### Global

`npm i -g esops`

`yarn global add esops`

#### Local

`npm i -D esops`

`yarn add esops --dev`

### Configure esops in `package.json`

Add the path of your template to your `package.json`

#### Using filesystem resolution

```json
{
  "esops": "./infrastructure"
}
```

#### Using `node` resolution

```json
{
  "esops": "node:my-typescript-stack/stack"
}
```

### Run `esops`

If global, just run `esops`. If local, use `npx esops`. Files will be generated, and if you have a `.gitignore`, it will be updated to include the generated files.

### To Clean Files

To refresh your codebase, if you had a `.gitignore` and esops generated an ignore list there, you can remove files all `.gitignore`'d files [using a git command](https://stackoverflow.com/q/13541615) or a module like [remove-git-ignored](https://www.npmjs.com/package/remove-git-ignored).
