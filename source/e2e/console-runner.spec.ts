import * as spawn from 'await-spawn'
import {withTempDir} from '../../test-utils/withTempDir'

import {MOCK_STACKS} from '../core/examples'
import chalk from 'chalk'
const LogTitle = title => {
  console.log(chalk.bold.blue(title))
}
async function run() {
  const esops = require('../../library/run/index').default

  LogTitle('basic')
  await withTempDir(__dirname, MOCK_STACKS['basic'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-gitignore')
  await withTempDir(__dirname, MOCK_STACKS['basic-gitignore'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-package-json')
  await withTempDir(__dirname, MOCK_STACKS['basic-package-json'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-node-module')
  await withTempDir(__dirname, MOCK_STACKS['basic-node-module'], async cwd => {
    await spawn(`npm`, ['install'], {cwd})
    await esops({cwd})
  })

  LogTitle('basic-bad-path')
  await withTempDir(__dirname, MOCK_STACKS['basic-bad-path'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-bad-config')
  await withTempDir(__dirname, MOCK_STACKS['basic-bad-config'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-no-config')
  await withTempDir(__dirname, MOCK_STACKS['basic-no-config'], async cwd => {
    await esops({cwd})
  })

  LogTitle('basic-overwrite-cwd-file yes')
  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      const prompts = require('prompts')
      prompts.inject([true])
      await esops({cwd})
    }
  )

  LogTitle('basic-overwrite-cwd-file no')
  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      const prompts = require('prompts')
      prompts.inject([false])
      await esops({cwd})
    }
  )

  LogTitle('basic-overwrite-cwd-file cancel')
  await withTempDir(
    __dirname,
    MOCK_STACKS['basic-overwrite-cwd-file'],
    async cwd => {
      const prompts = require('prompts')
      prompts.inject([new Error('exit')])
      await esops({cwd})
    }
  )
}

/* 
# To see all console messages live
run this with `npx ts-node source/e2e/logging.spec.ts` and uncomment this line
 */
process.env.RUN_CONSOLE_TEST && run()
