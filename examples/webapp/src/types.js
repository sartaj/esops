// /* @flow */

// import type { Observable } from 'rxjs'
// import type { Store } from 'redux'

// /**
//  * Device
//  */

// export type DeviceId = string

// export type DeviceCore = {
//   +id: DeviceId,
// }

// export type GlovesV1DeviceSpecific = {
//   +connectionType: 'bluetooth-low-energy',
//   +serviceId: string,
//   +characteristicId: string
// }

// export type GlovesV1 = DeviceCore & GlovesV1DeviceSpecific

// export type Device = GlovesV1

// /**
//  * Instrument
//  */

// export type DeviceMap = any

// export type Instrument = {
//   +type: string,
//   +config: any,
//   +devices: Array<DeviceId>,
//   +deviceMap: DeviceMap
// }

// /**
//  * Tracks
//  */

// export type Filter = any

// export type Bus = any

// export type Track = {
//   +instrument: Instrument,
//   +filter: Array<Filter>,
//   +bus: Array<Bus>
// }

// /**
//  * Session
//  */

// export type SessionTracks = Array<Track>

// export type Session = {
//   +tracks: SessionTracks
// }

// export type Sessions = Array<Session>

// /**
//  * Workspace
//  */

// export type Workspace = {
//   +sessions: Sessions
// }

// /**
//  * App State
//  */

// export type AppState = {
//   +workspace?: Workspace,
//   +devices?: Array<Device>
// }

// /**
//  * App Driver
//  */

// export type AppDriver = {
//   +store: Store,
//   +state$: Observable<any>
// }
