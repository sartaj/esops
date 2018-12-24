import * as spawn from 'await-spawn'
import {withTempDir} from '../../test-utils/withTempDir'

import {MOCK_STACKS} from '../core/examples'

async function run() {
  const esops = require('../../library/run/index').default

  await withTempDir(__dirname, MOCK_STACKS['basic-gitignore'], async cwd => {
    await esops({cwd})
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-package-json'], async cwd => {
    await esops({cwd})
  })

  await withTempDir(__dirname, MOCK_STACKS['basic'], async cwd => {
    await esops({cwd})
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-node-module'], async cwd => {
    await spawn(`npm`, ['install'], {cwd})
    await esops({cwd})
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-path'], async cwd => {
    await esops({cwd})
  })

  await withTempDir(__dirname, MOCK_STACKS['basic-bad-config'], async cwd => {
    await esops({cwd})
  })
}

/* 
# To see all console messages live
run this with `npx ts-node source/e2e/logging.spec.ts` and uncomment this line
 */
process.env.RUN_CONSOLE_TEST && run()
