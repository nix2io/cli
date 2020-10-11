# Nix2 CLI
*Nix2 Command Line Interface*

## Installation
All you need is to install is node

```sh
$ npm i -g @nix2/nix-cli
```

## Usage

The basic command is `nix-cli` which if you are using the [zsh plugin](https://github.com/nix2io/cli-zsh-plugin) you are given an alias of `dev`.
The rest of the documentation uses `dev` but should be the same for `nix-cli`.

When running the command with no arguments, it will default to `dev info`.

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

> **_NOTE_**  Each author's data is cached for the most recent usage so you don't need to retype all these parameters each time you add an author. To clear cache please read [this](#clear)

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

### Cache

#### Clear

To clear all the cache use:

```sh
$ dev cache clear
```