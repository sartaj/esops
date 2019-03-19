import async from '../../helpers/async'
import {spawnWithDebug} from './spawn'

const asyncSpawn = async.fromNodeCallback(spawnWithDebug)

export const spawn = (...args) => async.result(asyncSpawn(...args))
// export const spawn = spawnWithDebug

export default {
  sequence: (...args) => {},
  forkIf: (...args) => {},
  parallel: (...args) => {}
}
