#!/usr/bin/env node
const
    chalk = require('chalk'),
    commander = require('commander'),
    comparePackageJsons = require('../lib/compare-package-jsons'),
    loadMonorepoPackageJsons = require('../lib/load-monorepo-package-jsons'),
    fs = require('fs'),
    path = require('path')
let
    monorepoDir, appDir

commander
    .arguments('<monorepo-dir> [app-dir]')
    .action((...args) => {
        [monorepoDir, appDir] = args
    })
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    commander.help()
}

monorepoDir = path.resolve(monorepoDir)

if (!fs.existsSync(monorepoDir)) {
    console.error('  error: `monorepo-dir\' has to exist')
    process.exit(1)
}

if (appDir) {
    appDir = path.resolve(appDir)

    if (!fs.existsSync(appDir)) {
        console.error('  error: `app-dir\' has to exist')
        process.exit(1)
    }
}

const packageJsons = loadMonorepoPackageJsons(monorepoDir)

if (appDir) {
    packageJsons.push(require(path.join(appDir, 'package.json')))
}

const differences = comparePackageJsons(packageJsons)

if (differences.length === 0) {
    console.log(chalk.green('All versions are ok!'))
} else {
    console.log(chalk.red('Found different versions of dependencies being used:'))
    differences.forEach((dependency) => {
        console.log(chalk.red(`- ${dependency.name}`))
        dependency.versions.forEach((version) => {
            console.log(chalk.red(`\t${chalk.bold(version.version)} by ${version.where.join(', ')}`))
        })
    })
    process.exit(1)
}
