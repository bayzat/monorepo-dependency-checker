#!/usr/bin/env node
const
    chalk = require('chalk'),
    commander = require('commander'),
    comparePackageJsons = require('../lib/compare-package-jsons'),
    loadMonorepoPackageJsons = require('../lib/load-monorepo-package-jsons'),
    fs = require('fs'),
    path = require('path')
let
    monorepoDir

commander
    .arguments('<monorepo-dir>')
    .action((...args) => {
        [monorepoDir] = args
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

const differences = comparePackageJsons(loadMonorepoPackageJsons(monorepoDir))

if (differences.length === 0) {
    console.log(chalk.green('All versions are ok!'))
} else {
    console.log(chalk.red('There are used different versions of those dependencies:'))
    differences.forEach((dependency) => {
        console.log(chalk.red(`- ${dependency.name}`))
        dependency.versions.forEach((version) => {
            console.log(chalk.red(`\t${version.version} by ${version.where.join(', ')}`))
        })
    })
    process.exit(1)
}
