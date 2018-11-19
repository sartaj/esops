declare const resolveStackPackage: (pkg: any, { cwd }: {
    cwd: any;
}) => Promise<string>;
declare function findStackDefinition(cwd: any): any;
declare function resolve(): void;
export { resolve, findStackDefinition, resolveStackPackage };
