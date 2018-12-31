<div align="center">

![](assets/logo.png)

</div>

<h1 align="center">esops</h1>

<div align="center">
  <h3 align="center">Decoupled Architecture</h3>
  <h6 align="center">Template Generation with a Twist: Automatically Add Generated Files to Ignore Files.</h6>
</div>

<p align="center">
  <a href="https://npmjs.org/package/esops">
    <img src="https://img.shields.io/npm/v/esops.svg" alt="version" />
  </a>
  <a href="https://travis-ci.org/sartaj/esops">
    <img src="https://travis-ci.com/sartaj/esops.svg?branch=master" alt="travis" />
  </a>
</p>

- **Decouple Your Infrastructure**: manage codependent config files like `.eslintrc`, `tsconfig.json`, and `.prettierrc` in a separate directory or module.
- **Generate Files**: Copy files in a directory from a stack directory.
- **Managed Ignore Files**: If a `.gitignore` and/or `.npmignore` exists, automatically update it with a list of generated files.
- **Clean Codebases**: Maintain cleaner code bases by reducing number of config files in the root.

<div align="center">

![ ](https://raw.githubusercontent.com/sartaj/esops/master/assets/esops-demo.gif)

</div>

## Install

Install globally or locally

### Global

```bash
npm install -g esops
yarn global add esops
```

### Local

```bash
npm install -save-dev esops
yarn add esops --dev`
```

## Setup

Config esops in `package.json` or `esops.json`

**`esops.json`**

```json
"node:@myorg/my-stack/stack"
```

**`package.json`**

```json
{
  "esops": "node:@myorg/my-stack/stack"
}
```

## Resolution Types

- _Filesystem:_ `['./infrastructure']`
- _Node Module:_ `['node:@myorg/my-stack/stack']`

## Running

If global, just run `esops`. If local, use `npx esops`. Files will be generated, and if you have a `.gitignore`, it will be updated to include the generated files.

A good place to run esops would be as a [prepare](https://docs.npmjs.com/misc/scripts) command in your npm scripts, as it will run esops on every dev install.

```json
{
  "scripts": {
    "prepare": "esops --overwrite"
  }
}
```

## To Clean Files

To refresh your codebase, if you had a `.gitignore` and esops generated an ignore list there, you can remove files all `.gitignore`'d files [using a git command](https://stackoverflow.com/q/13541615) or a module like [remove-git-ignored](https://www.npmjs.com/package/remove-git-ignored).

## Why

There are so many developer tools out there, like `eslint`, `prettier`, and `typescript`, that have codependent config files that have to be available at the root level of project to enable features like code editor integration. The management of these files can be considered a separate concern from your project goal.

By separating these files, and adding them as auto-ignored template files, you can update and manage your infrastructure separately from your client code.

New `eslint` settings? Need to support `prettier` now? Someone on the team wants better `vscode` integration? With `esops`, generated files don't pollute git or npm, thus not having to deal with rebasing or codgen issues that happen with other template generators.

## Credits

- Logo: [Gilbert Baker Font](https://www.typewithpride.com/)
