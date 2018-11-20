/**
 * ## Primitives
 */
export type Path = string
export type SourcePath = Path
export type LocalTemplatePath = Path
export type TemporaryTemplatePath = Path
export type TemplatePath = LocalTemplatePath | TemporaryTemplatePath
export type TemplateUrl = string
export type TempGenerationPath = Path

export type TemplateOptions = {}
export type EsopsManifest = TemplateUrl | [TemplateUrl, TemplateOptions]

export type Drivers = {
  fs?: any
  http?: any
  logger?: any
}
export type InstallDrivers = (any) => ResolverOptions

/**
 * ## Main
 */
export type EsopsRun = (
  cwd: SourcePath,
  template?: TemplateUrl,
  options?: TemplateOptions
) => Promise<void>

/**
 * ## Resolve
 */
export type ResolverOptions = {
  cwd: SourcePath
  template?: TemplateUrl
  options?: TemplateOptions
  drivers: Drivers
}
export type Resolve = (options: ResolverOptions) => Promise<ParserOpts>

export type FindEsopsManifest = (cwd: SourcePath) => Promise<EsopsManifest>

export type FetchTemplate = (cwd: TemplateUrl) => Promise<TemporaryTemplatePath>

/**
 * ## Parse
 */
export type ParserOpts = {
  source: SourcePath
  template: TemplatePath
  options: TemplateOptions
  drivers: Drivers
}
export type Parser = (options: ParserOpts) => Promise<GeneratorOpts>

export type ConvertPathsToCopyManifest = (paths: Path[]) => CopyManifest

export type PatchWhitelist = [
  ['.json.template', 'RENDER_THEN_MERGE_JSON'],
  ['.json', 'MERGE_JSON'],
  ['.gitignore', 'MERGE_FILE'],
  ['.gitignore.template', 'RENDER_THEN_MERGE_FILE'],
  ['.npmignore', 'MERGE_FILE'],
  ['.npmignore.template', 'RENDER_THEN_MERGE_FILE'],
  ['.template', 'RENDER_TEMPLATE'],
  ['', 'COPY_AND_OVERRIDE']
]

export type Methods =
  | 'RENDER_THEN_MERGE_JSON'
  | 'MERGE_JSON'
  | 'MERGE_FILE'
  | 'RENDER_THEN_MERGE_FILE'

export type Copies = {
  outputDir: SourcePath
  templateDir: TemplatePath
  relativePath: Path
  method: Methods
}
export type CopyManifest = {
  options: TemplateOptions
  paths: Copies[]
}

/**
 * ## Generate
 */
export type GeneratorOpts = {
  drivers: Drivers
  manifest: CopyManifest
}
export type Generate = (options: CopyManifest) => Promise<boolean>

export type GenerateTemporaryFiles = (
  copyManifest: CopyManifest
) => Promise<TempGenerationPath>

export type ForceCopyFiles = (
  TempGenerationPath,
  DestinationPath
) => Promise<boolean>

/**
 * ## Exports
 */

export interface Resolver {
  default: Resolve
  findEsopsManifest: FindEsopsManifest
  fetchTemplate: FetchTemplate
  // recursiveStackResolver: (stackManifest: any) => any
}
export interface Parsers {
  default: Parser
  convertPathsToCopyManifest: ConvertPathsToCopyManifest
}

export interface Generator {
  default: Generate
  generateTmp: GenerateTemporaryFiles
  forceCopy: ForceCopyFiles
}

export interface Run {
  default: EsopsRun
}
