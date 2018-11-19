var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs-plus');
const isDirectory = require('is-directory');
const path = require('path');
const resolveStackPackage = (pkg, { cwd }) => __awaiter(this, void 0, void 0, function* () {
    try {
        let modulePath = '';
        if (!modulePath)
            modulePath = tryRelativePath(pkg, cwd);
        return modulePath + '/';
    }
    catch (e) {
        console.error(e);
        throw new Error('path resolution failed');
    }
});
const getStackFilePaths = templatePath => {
    const paths = fs.listTreeSync(templatePath);
    const filePaths = paths.filter(filePath => !isDirectory.sync(filePath));
    return filePaths;
};
module.exports.getStackFilePaths = getStackFilePaths;
const tryRelativePath = (pkg, cwd) => {
    const potentialPath = path.join(cwd, pkg);
    return fs.existsSync(potentialPath) ? potentialPath : null;
};
module.exports.tryRelativePath = tryRelativePath;
function findStackDefinition(cwd) {
    const possibleConfigPath = path.join(cwd, 'esops.json');
    try {
        const stackManifest = fs.readFileSync(possibleConfigPath, 'utf-8');
        return JSON.parse(stackManifest);
    }
    catch (e) {
        return [];
    }
}
function resolve() { }
export { resolve, findStackDefinition, resolveStackPackage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zb3VyY2UvcmVzb2x2ZXJzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBRTdCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUMzQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFFNUIsTUFBTSxtQkFBbUIsR0FBRyxDQUFPLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUU7SUFDL0MsSUFBSTtRQUNGLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQTtRQUNuQixJQUFJLENBQUMsVUFBVTtZQUFFLFVBQVUsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBT3ZELE9BQU8sVUFBVSxHQUFHLEdBQUcsQ0FBQTtLQUN4QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7S0FDMUM7QUFDSCxDQUFDLENBQUEsQ0FBQTtBQUVELE1BQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDLEVBQUU7SUFDdkMsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUczQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7SUFDdkUsT0FBTyxTQUFTLENBQUE7QUFDbEIsQ0FBQyxDQUFBO0FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQTtBQUVwRCxNQUFNLGVBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNuQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUN6QyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO0FBQzVELENBQUMsQ0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQTtBQUVoRCxTQUFTLG1CQUFtQixDQUFDLEdBQUc7SUFDOUIsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQTtJQUN2RCxJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUNsRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUE7S0FDakM7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sRUFBRSxDQUFBO0tBQ1Y7QUFDSCxDQUFDO0FBRUQsU0FBUyxPQUFPLEtBQUksQ0FBQztBQUVyQixPQUFPLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixFQUFFLENBQUEifQ==