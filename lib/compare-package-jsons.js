const
    INCORRECT_MONOREPO_VERSION = Symbol(),
    DIFFERENT_VERSION = Symbol()

function comparePackageJsons(packageJsons, monorepoVersion, managedPackageJsons) {
    const
        dependencyKeys = ['dependencies', 'devDependencies', 'peerDependencies'],
        managedPackagesVersions = {},
        versionMap = {},
        differences = {}

    managedPackageJsons.forEach((packageJson) => {
        const packageName = packageJson.name
        const version = packageJson.version
        versionMap[packageName] = versionMap[packageName] || {}
        versionMap[packageName][version] = versionMap[packageName][version] || []
        versionMap[packageName][version].push(packageName)
    })

    packageJsons.forEach((packageJson) => {
        if (packageJson.version !== monorepoVersion) {
            differences[INCORRECT_MONOREPO_VERSION] = differences[INCORRECT_MONOREPO_VERSION] || []
            differences[INCORRECT_MONOREPO_VERSION].push({
                name: packageJson.name,
                version: packageJson.version
            })
            differences.hasDifferences = true
        }

        dependencyKeys.forEach((key) => {
            if (packageJson[key]) {
                Object.keys(packageJson[key]).forEach((dependencyKey) => {
                    const version = packageJson[key][dependencyKey]

                    versionMap[dependencyKey] = versionMap[dependencyKey] || {}
                    versionMap[dependencyKey][version] = versionMap[dependencyKey][version] || []
                    versionMap[dependencyKey][version].push(packageJson.name)
                })
            }
        })
    })

    Object.keys(versionMap).forEach((dependencyKey) => {
        if (Object.keys(versionMap[dependencyKey]).length === 1) {
            return
        }

        const versions = Object.keys(versionMap[dependencyKey]).map((version) => {
            return {
                version,
                where: versionMap[dependencyKey][version]
            }
        }).sort((a, b) => {
            return (b.where.length - a.where.length)
        })

        differences[DIFFERENT_VERSION] = differences[DIFFERENT_VERSION] || []
        differences[DIFFERENT_VERSION].push({
            name: dependencyKey,
            versions
        })
        differences.hasDifferences = true
    })

    return differences
}

module.exports = {
    comparePackageJsons,
    types: [
        INCORRECT_MONOREPO_VERSION,
        DIFFERENT_VERSION
    ],
    INCORRECT_MONOREPO_VERSION,
    DIFFERENT_VERSION
}
