import async from '../../utilities/async'
import {spawnWithDebug} from './spawn'
import * as vm from 'vm'

const asyncSpawn = async.fromNodeCallback(spawnWithDebug)

export const spawn = (...args) => asyncSpawn(...args)
// export const spawn = spawnWithDebug
export {vm}

export default {
  sequence: (...args) => {},
  forkIf: (...args) => {},
  parallel: (...args) => {}
}
