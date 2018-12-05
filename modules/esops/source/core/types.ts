/**
 * ## Primitives
 */

export type Path = string
export type TemplateProps = {}
export type CWD = Path

export type TemporaryTemplatePath = Path
export type TempGenerationPath = Path

export type NetworkUrl = string
export type NetworkWithProps = [NetworkUrl, TemplateProps]
export type NetworkOption = NetworkUrl | NetworkWithProps
export type NetworkOptionArray = NetworkOption[]
export type NetworkOptions = NetworkOption | NetworkOptionArray
export type NetworkParams = {
  cwd: CWD
  opts: NetworkOptions
}

export type LocalPath = Path
export type LocalWithProps = [LocalPath, TemplateProps]
export type LocalOption = LocalPath | LocalWithProps
export type LocalOptionArray = LocalOption[]
export type LocalOptions = LocalOption | LocalOptionArray
export type LocalParams = {
  cwd: CWD
  opts: LocalOptions
}

export type TemplatePath = LocalPath | TemporaryTemplatePath
export type WithProps = LocalWithProps | NetworkWithProps
export type Option = LocalOption | NetworkOption
export type OptionArray = LocalOptionArray | NetworkOptionArray
export type Options = NetworkOptions | LocalOptions
export type Params = NetworkParams | LocalParams

/**
 * ## Resolve (Network + FS)
 */
export type ResolverOptions = {
  cwd: CWD
  opts: Options
}

export type Resolve = (options: ResolverOptions) => Promise<ParserOptions>

export type convertNetworkPathsToLocalPath = (
  options: Options
) => Promise<LocalOptions>

export interface Resolver {
  default: Resolve
  // recursiveStackResolver: (stackManifest: any) => any
}

/**
 * ## Parse (JS)
 */
type ParserOptions = {
  cwd: CWD
  opts: LocalOptions
}

export type Parser = (options: ParserOptions) => Promise<CopyManifest>

export type ConvertPathsToCopyManifest = (paths: Path[]) => CopyManifest

// export type PatchWhitelist = [
//   ['.json.template', 'RENDER_THEN_MERGE_JSON'],
//   ['.json', 'MERGE_JSON'],
//   ['.gitignore', 'MERGE_FILE'],
//   ['.gitignore.template', 'RENDER_THEN_MERGE_FILE'],
//   ['.npmignore', 'MERGE_FILE'],
//   ['.npmignore.template', 'RENDER_THEN_MERGE_FILE'],
//   ['.md', 'RENDER_THEN_MERGE_FILE']
//   ['.template', 'RENDER_TEMPLATE'],
//   ['', 'COPY_AND_OVERRIDE']
// ]

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
  options: LocalOptions
  paths: Copies[]
}

export interface Parsers {
  default: Parser
  convertPathsToCopyManifest: ConvertPathsToCopyManifest
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

export interface Generator {
  default: Generate
  generateTmp: GenerateTemporaryFiles
  forceCopy: ForceCopyFiles
}

/**
 * ## Run (JS)
 */

export type EsopsRun = (cwd: CWD, options?: Options) => Promise<void>

export interface Run {
  default: EsopsRun
}

/**
 * ## Bin (Process)
 */
export type EsopBin = () => Promise<void>
