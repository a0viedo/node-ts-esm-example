# node-ts-esm-example

This is an example of a Node.js service using TypeScript and compiling to ES Modules. It uses [SWC](https://swc.rs/) for compilation, [nodemon](https://github.com/remy/nodemon) for watching files and [tsx](https://github.com/privatenumber/tsx) for executing TypeScript files.

It includes Fastify to demonstrate the live-reloading functionality of an HTTP server and includes the `chalk` npm package in order to verify that it is able to import packages published as both CommonJS and ES Modules.

## Installation and usage
Run `npm install` and after that you should be able to run `npm run build` or `npm run start:dev`.
