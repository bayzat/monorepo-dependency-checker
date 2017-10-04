function comparePackageJsons(packageJsons) {
    const
        dependencyKeys = ['dependencies', 'devDependencies', 'peerDependencies'],
        versionMap = {},
        differences = []

    packageJsons.forEach((packageJson) => {
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

        differences.push({
            name: dependencyKey,
            versions
        })
    })

    return differences
}

module.exports = comparePackageJsons
