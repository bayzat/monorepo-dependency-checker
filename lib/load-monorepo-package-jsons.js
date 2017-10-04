const
    path = require('path'),
    glob = require('glob')

function loadMonorepoPackageJsons(monorepoDir) {
    const
        lernaJson = require(path.join(monorepoDir, 'lerna.json')),
        mainPackageJson = require(path.join(monorepoDir, 'package.json')),
        packageJsonsPaths = []

    lernaJson.packages.reduce((resultList, packagesPath) => {
        resultList.push(...glob.sync(path.join(packagesPath, 'package.json'), {
            cwd: monorepoDir,
            nodir: true
        }))
        return resultList
    }, packageJsonsPaths)

	return [mainPackageJson, ...packageJsonsPaths.map((packageJsonPath) => {
        return require(path.join(monorepoDir, packageJsonPath))
    })]
}

module.exports = loadMonorepoPackageJsons
