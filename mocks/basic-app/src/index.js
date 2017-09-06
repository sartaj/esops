/* @flow */

import type { AppState } from './types'

// beep : string say -> string 
const beep = (say) => {
    console.log(`you said ${say}`);
    return say
}