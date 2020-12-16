<p align="center"><img height="220px" src="https://i.imgur.com/d3eyO62.png" alt="CLI Logo" /><p>

<p align="center">
  <strong>Nix² CLI</strong><br />
  <sub>this cli will allow nix² developers to easily create, modify, and maintain their services</sub>
</p>

<p align="center">
  [ <a href="#installation">Installation 💾</a> | <a href="#usage">Usage 🤓</a> | <a href="https://www.npmjs.com/package/@nix2/nix-cli">NPM 📦</a> | <a href="https://github.com/nix2io/cli">Github 🕸</a> ]
</p>

<p align="center">
  <img style="display: block; width: 100%; max-width: 700px" alt="CLI Screenshot" src="https://i.imgur.com/2N3YWHF.png">
</p>

## Installation

First install JavaScript Node and NPM.
Then the package may be installed using the following command:

```sh
$ npm i -g @nix2/nix-cli
```

## Usage

The basic command is `nix-cli` which if you are using the [zsh plugin](https://github.com/nix2io/cli-zsh-plugin) you are given an alias of `dev`.
The rest of the documentation uses `dev` but should be the same for `nix-cli`.

When running the command with no arguments, it will default to `dev info`.

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Table of Contents](#table-of-contents)
  - [Commands](#commands)
  - [Auth](#auth)
  - [Init](#init)
  - [Info](#info)
  - [Make](#make)
  - [Database](#database)
    - [Auth](#auth-1)
    - [List](#list)
    - [Create](#create)
    - [Link](#link)
  - [Schemas](#schemas)
    - [List](#list-1)
    - [Add](#add)
    - [Remove](#remove)
  - [Authors](#authors)
    - [List](#list-2)
    - [Add](#add-1)
    - [Remove](#remove-1)
  - [Plugins](#plugins)
    - [List](#list-3)
    - [Add](#add-2)
    - [Remove](#remove-2)
    - [Update](#update)
    - [NPR](#npr)
  - [Environment](#environment)
    - [List](#list-4)
    - [Switch Environments](#switch-environments)
  - [Version](#version)
  - [Update](#update-1)
  - [Cache](#cache)
    - [Clear](#clear)

### Commands

This CLI is built with commander.js, which generates help screens based off the structure of the application.
To get help on any commands, just run `dev help`.

```sh
$ dev help

Usage: nix-cli [options] [command]

Options:
  -v                        output cli version
  -h, --help                display help for command

Commands:
  auth                      authenticate to a user account
  info                      display service context info
  init [options] [dirname]  initialize a service
  make                      make things related to your service
  authors                   manage your authors
  cache                     manage your cache
  help [command]            display help for command
```

### Auth

Authenticate the CLI user.

> **_NOTE_** This is currently WIP so it is a mock authentication.

### Init

Initialize a service.

The init command needs to be provided a service type. If there is no service provided as the agument, it will prompt the user to select all the valid service types from a list.

Here are the two ways you can initialize.

```sh

$ dev init
? Select the type
> typescript
  graphql

$ dev init graphql

```

After selecting the service type, it will prompt you on filling in details for the service. Each service has different initialize data but there are four options that all are asked for, no matter the service type.

|     Name      | Description                  |            Default            |
| :-----------: | ---------------------------- | :---------------------------: |
| `identifier`  | Service Identifier           | Taken from the directory name |
|    `label`    | Service Label (for humans)   |   Taken from the service ID   |
| `description` | Service Description          |      `"A Nix² Service"`       |
| `userLeadDev` | Makes the user the `leadDev` |            `true`             |

### Info

The info command will give you basic info on your current Service Context.

```sh
$ dev info

Nix2 CLI version 1.0.1
local data from service.yaml
|
|  Blog (blog)
|  The blog service
|  v1.0.0  -  1 dev
|
```

### Make

The `make` command allows a developer to make certain services that are supported by a service. The access to files that can be created with `make` depends on your plugin configuration. Each service has different files that can be created with `make` but there are still some files that are avaliable with all plugins.

|    Name     |     File     | Description            |
| :---------: | :----------: | ---------------------- |
|  `readme`   | `README.md`  | Creates a README file. |
| `gitignore` | `.gitignore` | Creates a .gitignore   |

### Database

The database command or `db`, allows a developer to create, modify, deploy, maintain, and retire a service's database.

Nix2 uses [FaunaDB](https://fauna.com/) for databases.

#### Auth

Authenticates yourself with FaunaDB.

#### List

Lists all the Nix2 databases.

#### Create

Creates a service database.

#### Link

Links a service with a database.

### Schemas

Functionality for controlling service schemas.

#### List

Lists basic info for the service's schemas.

A shortcut for this command is `dev schemas`

```sh
$ dev schemas list

Displaying 1 schema
┌──────┬───────┬─────────────┐
│ ID   │ Label │ Description │
├──────┼───────┼─────────────┤
│ user │ User  │ A Serv User │
└──────┴───────┴─────────────┘
```

#### Add

Add schemas by their ID.

```sh
$ dev schemas add user

⚠  About to write to service.yaml

identifier: 'user'
label: 'User'
pluralName: 'users'
fields:

? Proceed with adding schema? Yes
✔ Schema user added
```

#### Remove

Remove schemas by their id.

```sh
$ dev schemas remove user

⚠  About to write to service.yaml

identifier: 'user'
label: 'User'
pluralName: 'users'
fields:

? Proceed with removing user? Yes
✔ Schema user removed
```

You can also use the `-y` flag to skip the confirmation screen.

### Authors

Functionality for controlling service authors.

#### List

Lists basic info for the service's authors.

A shortcut for this command is `dev authors`

```sh
$ dev authors list

Displaying 2 authors
┌──────────────────────┬──────────┬─────────┐
│ Email                │ Name     │ Flags   │
├──────────────────────┼──────────┼─────────┤
│ maxk@nix2.io         │ Max Koon │ leadDev │
├──────────────────────┼──────────┼─────────┤
│ support@nix2.io      │ Support  │ support │
└──────────────────────┴──────────┴─────────┘
```

#### Add

Add authors by their email.

```sh
$ dev authors add m@x.com

⚠  About to write to service.yaml

{
  email: 'm@x.com',
  name: 'Max',
  publicEmail: null,
  url: null,
  alert: 'none',
  flags: [ 'dev' ]
}

? Proceed with adding author? Yes
✔ Author m@x.com added
```

To add data to author you can use different parameters which can be listed with help flag.

This will return:

```sh)
$ dev authors add --help

Usage: nix-cli authors add [options] <email>

Options:
  -n, --authorName [name]          name of the author
  -E, --publicEmail [publicEmail]  email to use for the public
  -u, --url [url]                  author url
  -a, --alert [alert]              alert options
  -p, --public                     set the public flag
  -d, --dev                        developer flag
  -D, --ldev                       lead dev flag
  -s, --support                    support flag
  -y, --yes                        skip the confirmation screen
  -h, --help                       display help for command
```

> **_NOTE_** Each author's data is cached for the most recent usage so you don't need to retype all these parameters each time you add an author. To clear cache please read [this](#clear)

#### Remove

Remove authors by their email.

```sh
$ dev authors remove m@x.com

⚠  About to write to service.yaml

{
  email: 'm@x.com',
  name: 'Max',
  publicEmail: null,
  url: null,
  alert: 'none',
  flags: [ 'dev' ]
}

? Proceed with removing author? Yes
✔ Author m@x.com removed
```

You can also use the `-y` flag to skip the confirmation screen.

### Plugins

Plugins were added in version [1.1.0](https://github.com/nix2io/cli/releases/v1.1.0), and enhances the scalability of the CLI, and allow for core functions to be separate from the services.

You can manage plugins with the `plugin` command.

#### List

```sh
$ dev plugins list

----------
graphql
typescript
----------
```

#### Add

```sh
$ dev plugins add typescript

✓ Installed typescript
```

#### Remove

```sh
$ dev plugins remove typescript

✓ Removed typescript
```

#### Update

```sh
$ dev plugins update *

✓ Updated typescript
✓ Updated graphql
```

#### NPR

The Nix Plugin Registry is the container of all plugin information. Information including names, descriptions, and versions.

The NPR runs on the [npr repository](https://github.com/nix2io/npr). It functions completely with github actions.

### Environment

There are multiple environments for deployed services such as development and production.
With the `env` command you can manage your selected environment

#### List

List all the available environments

```sh
$ dev env list

------------
 - prod
 - dev  (selected)
------------
```

#### Switch Environments

```sh
$ dev env prod

✔ switched to env: 'prod'
```

### Version

Service versioning follows [Semantic Versioning](https://semver.org/)

To get the current version you can run

```sh
$ dev version

The 'example-service' is on version 2.0.1
```

You can bump the version manually by doing:

```sh
$ dev version 2.0.2

Updated version to 2.0.2
```

You can also bump with `patch`, `minor`, or `major`.

```sh
$ dev version minor

Updated version to 2.1.0
```

### Update

Updates the CLI with yarn.

```sh

$ dev update

✔ Updated the CLI
```

### Cache

#### Clear

To clear all the cache use:

```sh
$ dev cache clear
```
