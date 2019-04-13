type Path = string

export type ComponentVariables = {}

export type ComponentOptions = {
  mergeJson: []
  mergeFiles: []
  overwrite: []
}

export type Component =
  | string
  | [string, ComponentVariables]
  | [string, ComponentVariables, ComponentOptions]

export type SanitizedComponent = [string, ComponentVariables, ComponentOptions]

export type Compose = Component | Component[]

type Prompt = boolean | Error

export type UserParams = {
  root: string
  destination?: string
  compose?: Compose
  logLevel?: string
  prompts?: Prompt[]
}

export type Params = {
  effects: any
  destination: string
  root: string
  parent: SanitizedComponent
  compose?: Compose
  logLevel: string
  prompts: Prompt[]
  treeDepth: number
}

export type EsopsConfigObject = {
  destination?: Path
  compose?: Compose
}

export type EsopsConfig = EsopsConfigObject | Compose
