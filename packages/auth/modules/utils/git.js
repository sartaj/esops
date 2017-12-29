const fs = require('fs')
const { promisify } = require('util')
const findParentDir = require('find-parent-dir')
const path = require('path')

// const url = require('url')
// const path = require('path')
// const _ = require('lodash')
// const ghUrl = require('github-url-from-git')
const ini = require('ini')
// const inquirer = require('inquirer')
// const parseGhUrl = require('parse-github-repo-url')
// const request = require('request-promise').defaults({resolveWithFullResponse: true})
// const validator = require('validator')
// const log = require('npmlog')

const readFile = promisify(fs.readFile)

module.exports.getGitConfig = async ({ cwd = process.cwd() } = {}) => {
  try {
    const gitDirectory = findParentDir.sync(cwd, '.git')
    const gitConfig = await readFile(
      path.join(gitDirectory, './.git/config'),
      'utf8'
    )
    return ini.decode(gitConfig)
  } catch (e) {
    if (e.code === 'ENOENT') {
      return { status: 'not-found' }
    } else {
      return Promise.reject(
        new Error('Error while trying to retrieve git config', e)
      )
    }
  }
}

// async function getRemoteUrl({repository}) {
//   if (!repository || !repository.url) {
//     const gitConfig = await getGitConfig();
//     const repo = gitConfig['remote "origin"'].url;
//     if (!repo) throw new Error('No repository found.');
//     repository = {type: 'git', url: `${ghUrl(repo)}.git`};
//   }

//   const parsed = url.parse(repository.url);
//   parsed.auth = null;
//   parsed.protocol = 'https';
//   repository.url = url.format(parsed);

//   return repository.url;
// }

// module.exports = async function(pkg, info) {
//   const { repository } = pkg;
//   let repoUrl;
//   try {
//     const gitConfig = getGitConfig();
//     repoUrl = await getRemoteUrl(pkg);
//   } catch (err) {
//     log.error('Could not get repository url. Please create/add the repository.');
//     throw err;
//   }

//   log.verbose(`Detected git url: ${repoUrl}`);
//   info.giturl = repoUrl;
//   const parsedUrl = parseGhUrl(repoUrl);

//   if (!parsedUrl) {
//     log.info('Not a reqular GitHub URL.');
//     const eurl = url.parse(repoUrl);
//     delete eurl.pathname;
//     delete eurl.search;
//     delete eurl.query;
//     delete eurl.hash;

//     const answers = await inquirer.prompt([
//       {
//         type: 'confirm',
//         name: 'enterprise',
//         message: 'Are you using GitHub Enterprise?',
//         default: true,
//       },
//       {
//         type: 'input',
//         name: 'url',
//         message: 'What is your GitHub Enterprise url?',
//         default: url.format(eurl),
//         when: _.bind(_.get, null, _, 'enterprise'),
//         validate: _.bind(validator.isURL, null, _, {protocols: ['http', 'https'], require_protocol: true}), // eslint-disable-line camelcase
//       },
//     ]);
//     info.ghepurl = answers.url;
//     return;
//   }

//   info.ghrepo = {slug: parsedUrl};

//   try {
//     await request.head(repoUrl);
//   } catch (err) {
//     const answers = await inquirer.prompt([
//       {
//         type: 'confirm',
//         name: 'private',
//         message: 'Is the GitHub repository private?',
//         default: false,
//       },
//     ]);
//     _.assign(info.ghrepo, answers);
//     if (answers.private) return;
//     throw new Error('Could not access GitHub repository');
//   }
// };
