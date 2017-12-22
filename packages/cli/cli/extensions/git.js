/* eslint-disable */
const parse = require('parse-git-config');
const simpleGit = require('simple-git');
const GitUrlParse = require("git-url-parse");

module.exports = (context) => {
    const gitCommands = simpleGit(context.cwd)
    context.git = {
        ...gitCommands,
        ...{ 
            getInfo: ()  => parse.sync(),
            parse: () => GitUrlParse(parse.sync()['remote "origin"'].url)
        }
    }
  }
  