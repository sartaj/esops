# Reggie CLI

Create javascript modules in an elm-like environment with no build configuration.

Includes support for react and react-native.

A best faith effort to create a 0 config CLI tool that JS environment instantly gives you an environment with similar principles to elm, but with javascript + react/react-native.

## Quick Start

```sh
$ npm install -g reggie-cli
$ reggie lint
```

## Principles

* **Enforce subset of JavaScript similar to elm:** From fp principles to immutability, we use a combination of a few eslint configs to enforce proper js coding.

* **Enforce versioning on release**: Just like with elm, reggie is designed to make it easy to publish to npm, enforcing versioning standards based on commit messages.

* **Enforce comments**: Enforce a minimum number of comments per file, hopefully encouraging a more literate programming format.

* **Instant Future JS/JSX**: With webpack built in, you can easily build any JS/JSX project using the latest JS technology features.

* **Clean code easily**: With prettier built-in, fix many linting issues automatticaly. This is similar to elm's auto fix.

* **One dependency:** The first and only dependency needed to instantly code and build most small modules, hiding tooling complexity and providing smart defaults.

* **Zero Configuration:** There are no configuration files. Configuring both development and production builds is handled for you so you can focus on writing code.

* **No Lock-In:** Specifically made for beginners and to provide fast bootstrap for new projects, reggie doesn't intend to be the tool you have to use. Soon you may outgrow, reggie, which in case you can do reggie eject.

* **Code Editor Setup**: Currently for VSCode only. Setup VSCode with recommended settings.

## Why Use This?

JavaScript is a multi-paradigm language, which is a great thing for such a heavily used language. However, when designing systems, it's important to follow certain design patterns.

This project is designed to provide guides for better package development, using a subset of JavaScript better designed for functional and reactive programming.
