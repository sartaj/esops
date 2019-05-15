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
  | SanitizedComponent

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

export type Effects = {
  filesystem: {
    appCache: {
      getRenderPrepFolder: () => Promise<string>
    }
  }
  resolver: {}
  ui: {}
  shell: {}
  vm: {}
}

export type Params = {
  effects: {}
  destination: string
  root: string
  parent: SanitizedComponent
  compose?: Compose
  logLevel: string
  prompts: Prompt[]
  results: Report[]
  treeDepth: number
}

export type EsopsConfigObject = {
  destination?: Path
  compose?: Compose
}

export type EsopsConfig = EsopsConfigObject | Compose

export type Report = {
  from: string
  to: string
  relativePath: string
  shouldMergeJson: boolean
  shouldMergeFile: boolean
  shouldGitPublish: boolean
  mergeJsonArrays: string[]
}[]

export type ResolverFunc = (
  params: any,
  sanitizedComponent: any
) => Promise<string>
