import async from '../../utilities/async'
import {spawnWithDebug} from './spawn'

const asyncSpawn = async.fromNodeCallback(spawnWithDebug)

export const spawn = (...args) => asyncSpawn(...args)
// export const spawn = spawnWithDebug

export default {
  sequence: (...args) => {},
  forkIf: (...args) => {},
  parallel: (...args) => {}
}
