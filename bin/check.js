#!/usr/bin/env node
const
    chalk = require('chalk'),
    commander = require('commander'),
    {
        comparePackageJsons,
        INCORRECT_MONOREPO_VERSION,
        DIFFERENT_VERSION,
        types: differenceTypes
    } = require('../lib/compare-package-jsons'),
    loadMonorepoPackageJsons = require('../lib/load-monorepo-package-jsons'),
    fs = require('fs'),
    path = require('path'),
    differenceMessages = {
        [INCORRECT_MONOREPO_VERSION]: 'incorrect monorepo version',
        [DIFFERENT_VERSION]: 'different versions of dependencies'
    }
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

const monorepoVersion = require(path.join(monorepoDir, 'lerna.json')).version
const packageJsons = loadMonorepoPackageJsons(monorepoDir)
const managedPackageJsons = packageJsons.filter((packageJson) => {
    return !packageJsons.isMainPackageJson
})

console.log(chalk.cyan(`Monorepo version: ${monorepoVersion}\n`))

if (appDir) {
    packageJsons.push(require(path.join(appDir, 'package.json')))
}

const differences = comparePackageJsons(packageJsons, monorepoVersion, managedPackageJsons)

if (!differences.hasDifferences) {
    console.log(chalk.green('All versions are ok!'))
} else {
    function formatIncorrectMonorepoVersion(dependency) {
        console.log(chalk.red(`- ${dependency.name}`))
        console.log(chalk.red(`\t${chalk.bold(dependency.version)} is actual version`))
        console.log(chalk.red(`\t${chalk.bold(monorepoVersion)} is expected version`))
    }

    function formatDifferentVersion(dependency) {
        console.log(chalk.red(`- ${dependency.name}`))
        dependency.versions.forEach((version) => {
            console.log(chalk.red(`\t${chalk.bold(version.version)} by ${version.where.join(', ')}`))
        })
    }

    differenceTypes.forEach((type) => {
        if (differences.hasOwnProperty(type)) {
            console.log(chalk.red(`Found ${differenceMessages[type]} being used:`))
            differences[type].forEach(
                type === INCORRECT_MONOREPO_VERSION
                ? formatIncorrectMonorepoVersion
                : formatDifferentVersion
            )
            console.log()
        }
    })
    process.exit(1)
}
