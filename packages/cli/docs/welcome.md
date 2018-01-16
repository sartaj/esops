esops - learn once. publish everywhere.

__Publishing Platforms__

# Static Web ➡ GitHub Pages

Make a simple website with free hosting.

## Commands

```bash
    esops dev static-github
```

```bash
    esops ship static-github
```

## Optional

Use React Native if you'd like to reuse certain parts of your app with other platforms, like iOS, Android, etc. 

`yarn add react react-dom react-native-web`

 __

Notes:

`dev` will create the development package. It will look for a entry file either via the `package.json` or some common entry files, such as `index.js`, `src/index.js`, etc.

`ship` will attempt to publish to the listed publisher.

`esops` is to designed with the hopes of finding the absolute minimum knowledge required to be able to publish to as many different platforms as possible.