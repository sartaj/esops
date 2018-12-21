# esops - Declarative Infrastructure

Template generation with a twist: automatically add generated files to ignore files.

## Benefits

- Manage combined config files likes `.eslintrc`, `tsconfig.json`, `.prettierrc`, and code editor settings in a separate directory or module, allowing your to further decouple your devops.
- Maintain cleaner code bases by reducing number of config files in the root

## Features

- Generate files in a directory from a template directory
- Automatically manage `.gitignore` file by adding generated files.

## Why

There are so many developer tools out there, like `eslint`, `prettier`, and `typescript`, that require config files to be available at the root level of project to enable features like code editor integration. However, often these configurations become dependent on each other for proper usage.

By adding generated template files to ignore files, you can manage your infrastructure separately from your client code.

New eslint settings? Need to support prettier now? With `esops`, generated files don't pollute git or npm, thus not having to deal with rebasing or codgen issues that happen with other template generators.

## How to Use

### Install `esops`

Install globally or locally

#### Global

`npm i -g esops`
`yarn global add esops`

#### Local

`npm i -D esops`
`yarn add esops --dev`

Add the path of your template to your `package.json`

### Configure `package.json`

Add the local path to your template.

```json
{
  "esops": "./node_modules/@foo/my-stack"
}
```

### Run `esops`

If global, just run `esops`. If local, use `npx esops`. Files will be generated, and if you have a `.gitignore`, it will be updated to include the generated files.
