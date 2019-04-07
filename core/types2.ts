type Path = string

export type ComponentVariables = {}

export type ComponentOptions = {
  mergeJson: []
  mergeFiles: []
  overwrite: []
}

type Component =
  | string
  | [string, ComponentVariables]
  | [string, ComponentVariables, ComponentOptions]

export type Compose = Component | Component[]

// export type
export type Params = {
  effects?: any
  destination?: string
  root?: string
  parent?: string
  compose?: Compose
  logLevel?: string
  cwd?: string // deprecated
}

export type EsopsConfigObject = {
  destination?: Path
  compose?: Compose
}

export type EsopsConfig = EsopsConfigObject | Compose
