/**
 * ## Primitives
 */
export type Path = string
export type CWD = Path
export type LocalTemplatePath = Path
export type TemporaryTemplatePath = Path
export type TemplatePath = LocalTemplatePath | TemporaryTemplatePath
export type TemplateUrl = string
export type TempGenerationPath = Path

/**
 * Options
 */

export type TemplateProps = {}

export type NetworkTemplateOption = TemplateUrl | [TemplateUrl, TemplateProps]

export type NetworkTemplateOptions =
  | NetworkTemplateOption
  | NetworkTemplateOption[]

export type LocalTemplateOption =
  | LocalTemplatePath
  | [LocalTemplatePath, TemplateProps]

export type LocalTemplateOptions = LocalTemplateOption | LocalTemplateOption[]

export type NetworkOptions = {
  cwd: CWD
  opts: NetworkTemplateOptions
}

export type LocalOptions = {
  cwd: CWD
  opts: LocalTemplateOptions
}

/**
 * ## Bin (Process)
 */
export type EsopBin = () => Promise<void>

/**
 * ## Run (JS)
 */
export type EsopsRun = (cwd: CWD, options?: NetworkOptions) => Promise<void>

/**
 * ## Resolve (Network + FS)
 */
export type ResolverOptions = {
  cwd: CWD
  opts: NetworkTemplateOptions
}

export type Resolve = (options: ResolverOptions) => Promise<ParserOptions>

/**
 * ## Parse (JS)
 */
type ParserOptions = {
  cwd: CWD
  opts: LocalTemplateOptions
}
export type Parser = (options: ParserOptions) => Promise<CopyManifest>

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
  outputDir: CWD
  templateDir: TemplatePath
  relativePath: Path
  method: Methods
}
export type CopyManifest = {
  options: LocalTemplateOptions
  paths: Copies[]
}

/**
 * ## Generate (FS)
 */
export type Generate = (manifest: CopyManifest) => Promise<boolean>

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
