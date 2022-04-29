# next-zoup

Toying around with the [zoup spec](https://github.com/zoupio/spec) to see where that may lead.

The idea is the following:

I want to use Next.js and Typescript to build an implementation of the given [spec.md](https://github.com/zoupio/spec/blob/main/spec.md) to get some insight into how that spec behaves and to get a rough idea of the work required to get it running.

The first prototype shall keep all state in local files in the hope that this will aid development and setup and be an ok starting point. It should always be possible to add more complexity and dependencies later.

## setup and scripts

This project uses [node](https://nodejs.org/) and [yarn](https://yarnpkg.com/).
If you've got node installed on your machine chances are you're good to go.

Execute `yarn install` to locally install the node dependencies into the `node_modules` directory.
Afterwards execute `yarn dev` to run a development server at `localhost:3000`.

For production the project is first built using `yarn build` and afterwards executed with `yarn start`.

The linter is executed with `yarn lint`.

### environment variables

Some configuration is done via environment variables.
In addition to the environment these can be set via a `.env.local` file.
The checked in file `.env.example` contains example values and lists all used environment variables.
