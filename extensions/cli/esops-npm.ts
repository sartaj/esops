import {execSync} from 'child_process'
import * as stableStringify from 'json-stable-stringify'
import * as path from 'path'
import createFsSideEffects from '../../side-effects/fs'
import {createInteractiveConsoleUX} from '../../side-effects'
import {minimist} from '../../side-effects/console/components/cli'

const fs = createFsSideEffects()
const ui = createInteractiveConsoleUX('info')

const sortJsonKeys = sortToTop => (a, b) => {
  for (let key of sortToTop) {
    if (a.key === key) {
      return -1 // a is greater than b
    }
    if (b.key === key) {
      return 1 // b is greater than a
    }
  }

  return a.key.toLowerCase().localeCompare(b.key.toLowerCase())
}

const sortMap = {
  'package.json': sortJsonKeys([
    'name',
    'description',
    'version',
    'keywords',
    'scripts',
    'keywords',
    'author',
    'license',
    'homepage',
    'repository',
    'bugs',
    'license',
    'main',
    'bin',
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ])
}

const stringify = (type?: string) => str =>
  stableStringify(str, {
    space: 2,
    cmp: type ? sortMap[type] : undefined
  })

function addToPackageJson(dependencies: string[], opts) {
  const depsToAdd = dependencies
    .map(dep => dep.toLowerCase().split('@'))
    .map((dep: [string, string] | [string]) => {
      if (!dep[1]) {
        const results = String(execSync(`npm show ${dep[0]} version`)).trim()
        if (!results) {
          console.error(results)
          process.exit(1)
        }
        return {[dep[0]]: results}
      } else {
        return {[dep[0]]: dep[1]}
      }
    })
    .reduce((packages, pkg) => ({...packages, ...pkg}), {})

  const pkgJsonDir = path.resolve(opts.cwd, 'package.json')
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonDir, 'utf-8'))
  const depType = opts.dev
    ? 'devDependencies'
    : opts.peer
    ? 'peerDependencies'
    : 'dependencies'

  const updatedPkg = {
    ...pkgJson,
    [depType]: {
      ...pkgJson[depType],
      ...depsToAdd
    }
  }

  fs.writeFileSync(pkgJsonDir, stringify('package.json')(updatedPkg))
}

function removeFromPackageJson(dependencies: string[], opts) {
  const pkgJsonDir = path.resolve(opts.cwd, 'package.json')
  let pkgJson = JSON.parse(fs.readFileSync(pkgJsonDir, 'utf-8'))

  const depType = opts.dev
    ? 'devDependencies'
    : opts.peer
    ? 'peerDependencies'
    : 'dependencies'

  for (let i = 0; i < dependencies.length; i++) {
    delete pkgJson[depType][dependencies[i]]
  }

  fs.writeFileSync(pkgJsonDir, stringify('package.json')(pkgJson))
}

const resolveEsops = opts => {
  const esopsDir = path.resolve(opts.cwd, 'esops.json')
  const esopsJson = JSON.parse(fs.readFileSync(esopsDir, 'utf-8'))

  const destination = esopsJson.destination
    ? path.resolve(opts.cwd, esopsJson.destination)
    : opts.cwd

  const lastCompose = esopsJson.compose && esopsJson.compose.slice(-1)[0]
  const lastComposePath = path.resolve(opts.cwd, lastCompose)
  const lastComposeIsLocalPath = lastCompose.startsWith('.')

  if (!lastComposeIsLocalPath) {
    throw new Error(
      'esops-npm only works when the last component in your esops compose is a local path'
    )
  }
  return {
    destination,
    lastComposePath,
    lastCompose
  }
}

const addRemoveMsg = ({
  start,
  lastCompose,
  relativeDestination,
  dependencies
}) => {
  ui.md(
    `# ${start}
**${lastCompose}/package.json**:
**${relativeDestination}/package.json**  \n\n ${dependencies
      .map(str => `* ${str}`)
      .join('\n')} `
  )
}

const addModules = runPackageManager => (dependencies: string[], opts) => {
  ui.info(`adding packages...`)

  const {destination, lastComposePath, lastCompose} = resolveEsops(opts)

  addToPackageJson(dependencies, {
    ...opts,
    cwd: lastComposePath
  })

  addToPackageJson(dependencies, {
    ...opts,
    cwd: destination
  })

  addRemoveMsg({
    start: 'Added to',
    lastCompose,
    relativeDestination: path.relative(opts.cwd, destination),
    dependencies
  })

  runPackageManager({destination, lastComposePath, lastCompose})
}

const removeModules = runPackageManager => (dependencies: string[], opts) => {
  ui.info(`removing packages...`)

  const {destination, lastComposePath, lastCompose} = resolveEsops(opts)

  removeFromPackageJson(dependencies, {
    ...opts,
    cwd: lastComposePath
  })

  removeFromPackageJson(dependencies, {
    ...opts,
    cwd: destination
  })

  addRemoveMsg({
    start: 'Removed from',
    lastCompose,
    relativeDestination: path.relative(opts.cwd, destination),
    dependencies
  })

  runPackageManager({destination, lastComposePath, lastCompose})
}

function runNpm({destination, lastComposePath, lastCompose}) {
  execSync('npm install', {cwd: destination, stdio: 'inherit'})
  execSync('npm prune', {cwd: destination, stdio: 'inherit'})
  ui.info('\n\nnpm install and prune ran')
  const file = 'package-lock.json'
  const from = path.join(destination, file)
  const to = path.join(lastComposePath, file)
  fs.forceCopy(from, to)
  ui.md(`**${file}** copied to **${lastCompose}/${file}**`)
}

function runYarn({destination, lastComposePath, lastCompose}) {
  execSync('yarn', {cwd: destination, stdio: 'inherit'})
  ui.info(`\n\nyarn ran`)
  const file = 'yarn.lock'
  const from = path.join(destination, file)
  const to = path.join(lastComposePath, file)
  fs.forceCopy(from, to)
  ui.md(`**${file}** copied to **${lastCompose}/${file}**`)
}

const npmCompose = pkg => {
  const args = minimist(process.argv.slice(2))

  const cwd = process.cwd()

  const dev = args._[1] === 'dev' ? true : false
  const peer = args._[1] === 'peer' ? true : false
  const slice = dev || peer ? 2 : 1
  const dependencies = args._.slice(slice)
  const runPackageManager = pkg === 'npm' ? runNpm : runYarn

  switch (args._[0]) {
    case 'add':
      addModules(runPackageManager)(dependencies, {dev, peer, cwd})
      break
    case 'remove':
      removeModules(runPackageManager)(dependencies, {dev, peer, cwd})
      break
    default:
      break
  }
}

if (!module.parent) {
  npmCompose('npm')
}
