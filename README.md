## Goals

* Design around decoupled features users can define, instead of configs + plugins.
* Powerful CLI tool that rarely does templates and instead outputs guides in the CLI.
* Allow CLI tool to read from easy to PR repos, kind of like how `flow-types` repo works.
* Allow for default and easy path configs.
* Build in version management, hopefully based on auto generated.
* Build in docs builder.
* Support shipping to: github-pages, npm, serverless, and react-native.
* Support primary dev flow of dev, staging, prod.
* Support primary dev flow of init, edit, debug, and release.
* Don't mess with non devDependencies.
* Easy to extend and build a single white labeled CLI tool on.