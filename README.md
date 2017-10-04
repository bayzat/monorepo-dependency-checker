# monorepo-dependency-checker

Check for consistent usage of version across the monorepo packages.

## Prerequisites

This tool assumes that you use [Lerna](https://lernajs.io/) for the monorepo multiple package management.

## Installing

Via npm:

```bash
$ npm install --save-dev github:synaptiko/monorepo-dependency-checker
```

Via yarn:

```bash
$ yarn add --dev github:synaptiko/monorepo-dependency-checker
```

## Usage

Define it as a script in your monorepo root `package.json`:

```json
{
  "name": "my-monorepo",
  "version": "0.0.1",
  "devDependencies": {
    "monorepo-dependency-checker": "github:synaptiko/monorepo-dependency-checker"
  },
  "script": {
    "check-dependencies": "monorepo-dependency-checker ."
  }
}
```

and then run as `npm run check-dependencies` or `yarn run check-dependencies`.

You can also use it manually by running `./node_modules/.bin/monorepo-dependency-checker <monorepo-dir> [app-dir]`. The `app-dir` parameter is optional but it can be useful for you to check if your app uses the same versions of dependencies as you use in monorepo.
