# node-ts-esm-example

This is an example of a Node.js service using TypeScript and compiling to ES Modules. It uses [SWC]() for compilation, [nodemon]() for watching files and [tsx]() for executing TypeScript files.

It includes Fastify to demonstrate the live-reloading functionality of an HTTP server and includes the `chalk` npm package in order to verify that it is able to import packages published as both CommonJS and ES Modules.

## Installation and usage
Run `npm install` and after that you should be able to run `npm run build` or `npm run start:dev`.

---
title: Node.js, TypeScript and ESM: it doesn't have to be painful
published: false
description: 
tags: typescript, nodejs, esm
cover_image: https://imgur.com/nSD97FU.jpg
# Use a ratio of 100:42 for best results.
# published_at: 2023-12-01 09:47 +0000
---
I was thinking into starting a Node.js project from scratch and had an unsettling choice to make: to use ESM or CommonJS.

The decision of a few popular package authors to adopt ESM, coupled with the ongoing maturity of the tooling, strongly suggests that it is the direction most of the ecosystem will converge to _eventually_.

In this article, my goal is to present a solution that is not only rapid in execution but also leverages widely adopted and trusted tools.

**🙅🏻‍♂️🛑 Disclaimer**
This approach is thought to comply with applications running in Node.js, not on a browser. The module resolution will change drastically for other scenarios.

## Make it ESM
The first step is to make the project an ES Module. To do that you only need to include `"type": "module"` in your `package.json`.
An annoying detail for me (transitioning from CommonJS) is that ES Modules require the file extension on your imports, like this:

```js
import { hey } from './module-b.js'
```

We will see in the next section how it could be improved.


## tsconfig.json
This is a minimal version of a tsconfig that worked for my use case.

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ESNext",
    "isolatedModules": true,
    "esModuleInterop": true,
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "outDir": "dist",
    "lib": [ "esnext" ],
    "types": [ "node" ],
    "baseUrl": "./",
  },
  "exclude": [ "node_modules" ],
  "include": [
    "src/**/*.ts",
    "bin/*.ts"
  ]
}

```

Notice `allowImportingTsExtensions` defined in there. This will allow to use your imports like the following:

```ts
import { hey } from './module-b.ts'
```

## Compilation
I decided to use SWC to compile the project into JavaScript, primarily because of its speed. Bear in mind SWC will not run type-checking. For scenarios where type-checking is necessary, you can still utilize `tsc` to achieve this`:

```json
{
  "scripts": {
    "build": "swc src --out-dir dist/src",
    "build:ci": "tsc && npm run build"
  }
}
```

In order for the imports to work as expected this is the `.swcrc` config file that you will need:

```
{
  "exclude": "node_modules/",
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "topLevelAwait": true
    },
    "target": "esnext",
    "baseUrl": ".",
    "experimental": {
      "plugins": [
        [
          "@swc/plugin-transform-imports",
          {
            "^(.*?)(\\.ts)$": {
              "skipDefaultConversion": true,
              "transform": "{{matches.[1]}}.js"
            }
          }
        ]
      ]
    }
  },
  "module": {
    "type": "nodenext"
  }
}

```


## Live-reload
Also often times called hot-reloading, this functionality allows to watch your application files for changes and restart it when changes occur. I'm using SWC and nodemon to perform this, with exceedingly fast results. While using two different tools seems somewhat inconvenient I like it a lot because it leads to a single-responsibility goal: SWC only takes care of compiling our code and nodemon is in charge of watching JavaScript files and restarting the Node.js process.

Here are results showcasing the average time it took the server to restart, while watching for changes and running 10 times each using the example repository:

|   | time  |
|:-:|:-:|:-:|:-:|:-:|
| tsx  | 260ms  |
| SWC+nodemon  | 124ms  |

These numbers only measure from the time a change has been acknowledged to the new process has started successfully.

**Why not include `ts-node-dev` in these benchmarks?**
Sadly `ts-node-dev` is not currently compatible with the [ts-node loader](https://github.com/TypeStrong/ts-node#watching-and-restarting).

## Running TypeScript files
There will be times when you need to run TypeScript files on its own. On Node v20 I couldn't make `swc-node` work for that (if you do, please let me know!), so I decided to use `tsx`. It works and is very simple to use.

```json
{
  "scripts": {
    ...
    "migrate": "node --import tsx bin/run-migrations.ts"
    ...
  }
}

```

## Final thoughts
Using TypeScript and compiling to ESM on Node.js involves a greater degree of complexity than is often recognized. There are a lot of tweaks and knobs to turn, and tools that are supposed to work but don't. I created an example repository with all the things I mention on this article in case you want to check it out:


