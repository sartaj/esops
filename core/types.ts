import {sanitizeComponent} from './lenses'
import {listTreeSync} from 'fs-plus'
import {Path} from 'path'
import {PathLike} from 'fs'

// TODO: Figure out how to import path as a module without this patch.
declare module 'path' {
  interface Path {
    normalize(p: string): string
    join(...paths: any[]): string
    resolve(...pathSegments: any[]): string
    isAbsolute(p: string): boolean
    relative(from: string, to: string): string
    dirname(p: string): string
    basename(p: string, ext?: string): string
    extname(p: string): string
    sep: string
    delimiter: string
    parse(p: string): ParsedPath
    format(pP: FormatInputPathObject): string
  }
}

export type ComponentVariables = {}

export type ComponentOptions = {
  mergeJson: []
  mergeFiles: []
  overwrite: []
  merge: boolean
  publish: boolean
  o: string
  out: string
}

export type Component =
  | string
  | [string, ComponentVariables?, ComponentOptions?]
  | SanitizedComponent

export type SanitizedComponent = [string, ComponentVariables, ComponentOptions]

export type Compose = Component | Component[]

export type SanitizedCompose = SanitizedComponent[]

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
    path: Path
    appCache: {
      getRenderPrepFolder: () => Promise<string>
    }
    listTreeSync: (str: string) => string[]
    isDirectory: {
      sync: (isDirectory: string) => boolean
    }
    existsSync: (str: string) => boolean
    readFileSync(path: PathLike, options?: {encoding: string} | string): string
    writeFileSync: (s1: string, s2: string) => void
    forceCopy: (s1: string, s2: string) => void
  }
  resolve: (
    params: Params,
    sanitizeComponent: SanitizedComponent
  ) => SanitizedComponent
  ui: {
    getTabs: (n: number) => string
    info: (u: unknown) => void
  }
  shell: {}
  vm: {}
}

export type Params = {
  effects: Effects
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
  destination?: string
  compose?: Compose
}

export type EsopsConfig = EsopsConfigObject | Compose

export type Manifest = {
  from: string
  to: string
  relativePath: string
  shouldMergeJson: boolean
  shouldMergeFile: boolean
  shouldGitPublish: boolean
  mergeJsonArrays: string[]
}

export type Actions = Manifest[]
export type Report = Manifest[]

export type ResolverFunc = (
  params: any,
  sanitizedComponent: any
) => Promise<string>

export type ResolverExtension = {
  is: (componentString: string) => boolean
  resolve: ResolverFunc
  COMPONENT_TYPE: string
}
