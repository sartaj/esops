type Path = string

type SourcePath = Path
type TemplatePath = Path
type TempPath = Path
type ConsumerOptions = {}
type Copy = {}
type CopyManifest = Copy[]

export interface features {
  default: (
    cwd: SourcePath,
    template?: TemplatePath,
    opts?: ConsumerOptions
  ) => Promise<void>
  resolve: (
    cwd: SourcePath,
    template?: TemplatePath,
    opts?: ConsumerOptions
  ) => Promise<{src: SourcePath; template: TemplatePath; opts: ConsumerOptions}>
  fetchTemplate: (cwd: SourcePath) => Promise<SourcePath>
  // recursiveStackResolver: (stackManifest: any) => any
  parse: (paths: Path[]) => CopyManifest
  convertPathsToCopyManifest: (paths: Path[]) => CopyManifest
  // validate: (templatePath: string) => boolean,
  generate
  generateTmp: (copyManifest: CopyManifest) => Promise<TempPath>
  forceCopy: (TempPath, DestinationPath) => Promise<boolean>
}
