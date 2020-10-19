# Nix² CLI

_Nix² Command Line Interface_

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/nix2io/cli/CI)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/@nix2/nix-cli)
![npm](https://img.shields.io/npm/v/@nix2/nix-cli?label=npm%20version)
![GitHub package.json version](https://img.shields.io/github/package-json/v/nix2io/cli?label=dev%20version)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjUgNSAzNzAgMzcwIj48Y2lyY2xlIGN4PSIxODkiIGN5PSIxOTAiIHI9IjE4NCIgZmlsbD0iI2ZlMiIvPjxwYXRoIGZpbGw9IiM4YmIiIGQ9Ik0yNTEgMjU2bC0zOC0zOGExNyAxNyAwIDAxMC0yNGw1Ni01NmMyLTIgMi02IDAtN2wtMjAtMjFhNSA1IDAgMDAtNyAwbC0xMyAxMi05LTggMTMtMTNhMTcgMTcgMCAwMTI0IDBsMjEgMjFjNyA3IDcgMTcgMCAyNGwtNTYgNTdhNSA1IDAgMDAwIDdsMzggMzh6Ii8+PHBhdGggZmlsbD0iI2Q1MSIgZD0iTTMwMCAyODhsLTggOGMtNCA0LTExIDQtMTYgMGwtNDYtNDZjLTUtNS01LTEyIDAtMTZsOC04YzQtNCAxMS00IDE1IDBsNDcgNDdjNCA0IDQgMTEgMCAxNXoiLz48cGF0aCBmaWxsPSIjYjMwIiBkPSJNMjg1IDI1OGw3IDdjNCA0IDQgMTEgMCAxNWwtOCA4Yy00IDQtMTEgNC0xNiAwbC02LTdjNCA1IDExIDUgMTUgMGw4LTdjNC01IDQtMTIgMC0xNnoiLz48cGF0aCBmaWxsPSIjYTMwIiBkPSJNMjkxIDI2NGw4IDhjNCA0IDQgMTEgMCAxNmwtOCA3Yy00IDUtMTEgNS0xNSAwbC05LThjNSA1IDEyIDUgMTYgMGw4LThjNC00IDQtMTEgMC0xNXoiLz48cGF0aCBmaWxsPSIjZTYyIiBkPSJNMjYwIDIzM2wtNC00Yy02LTYtMTctNi0yMyAwLTcgNy03IDE3IDAgMjRsNCA0Yy00LTUtNC0xMSAwLTE2bDgtOGM0LTQgMTEtNCAxNSAweiIvPjxwYXRoIGZpbGw9IiNiNDAiIGQ9Ik0yODQgMzA0Yy00IDAtOC0xLTExLTRsLTQ3LTQ3Yy02LTYtNi0xNiAwLTIybDgtOGM2LTYgMTYtNiAyMiAwbDQ3IDQ2YzYgNyA2IDE3IDAgMjNsLTggOGMtMyAzLTcgNC0xMSA0em0tMzktNzZjLTEgMC0zIDAtNCAybC04IDdjLTIgMy0yIDcgMCA5bDQ3IDQ3YTYgNiAwIDAwOSAwbDctOGMzLTIgMy02IDAtOWwtNDYtNDZjLTItMi0zLTItNS0yeiIvPjxwYXRoIGZpbGw9IiMxY2MiIGQ9Ik0xNTIgMTEzbDE4LTE4IDE4IDE4LTE4IDE4em0xLTM1bDE4LTE4IDE4IDE4LTE4IDE4em0tOTAgODlsMTgtMTggMTggMTgtMTggMTh6bTM1LTM2bDE4LTE4IDE4IDE4LTE4IDE4eiIvPjxwYXRoIGZpbGw9IiMxZGQiIGQ9Ik0xMzQgMTMxbDE4LTE4IDE4IDE4LTE4IDE4em0tMzUgMzZsMTgtMTggMTggMTgtMTggMTh6Ii8+PHBhdGggZmlsbD0iIzJiYiIgZD0iTTExNiAxNDlsMTgtMTggMTggMTgtMTggMTh6bTU0LTU0bDE4LTE4IDE4IDE4LTE4IDE4em0tODkgOTBsMTgtMTggMTggMTgtMTggMTh6bTEzOS04NWwyMyAyM2M0IDQgNCAxMSAwIDE2TDE0MiAyNDBjLTQgNC0xMSA0LTE1IDBsLTI0LTI0Yy00LTQtNC0xMSAwLTE1bDEwMS0xMDFjNS01IDEyLTUgMTYgMHoiLz48cGF0aCBmaWxsPSIjM2VlIiBkPSJNMTM0IDk1bDE4LTE4IDE4IDE4LTE4IDE4em0tNTQgMThsMTgtMTcgMTggMTctMTggMTh6bTU1LTUzbDE4LTE4IDE4IDE4LTE4IDE4em05MyA0OGwtOC04Yy00LTUtMTEtNS0xNiAwTDEwMyAyMDFjLTQgNC00IDExIDAgMTVsOCA4Yy00LTQtNC0xMSAwLTE1bDEwMS0xMDFjNS00IDEyLTQgMTYgMHoiLz48cGF0aCBmaWxsPSIjOWVlIiBkPSJNMjcgMTMxbDE4LTE4IDE4IDE4LTE4IDE4em01NC01M2wxOC0xOCAxOCAxOC0xOCAxOHoiLz48cGF0aCBmaWxsPSIjMGFhIiBkPSJNMjMwIDExMGwxMyAxM2M0IDQgNCAxMSAwIDE2TDE0MiAyNDBjLTQgNC0xMSA0LTE1IDBsLTEzLTEzYzQgNCAxMSA0IDE1IDBsMTAxLTEwMWM1LTUgNS0xMSAwLTE2eiIvPjxwYXRoIGZpbGw9IiMxYWIiIGQ9Ik0xMzQgMjQ4Yy00IDAtOC0yLTExLTVsLTIzLTIzYTE2IDE2IDAgMDEwLTIzTDIwMSA5NmExNiAxNiAwIDAxMjIgMGwyNCAyNGM2IDYgNiAxNiAwIDIyTDE0NiAyNDNjLTMgMy03IDUtMTIgNXptNzgtMTQ3bC00IDItMTAxIDEwMWE2IDYgMCAwMDAgOWwyMyAyM2E2IDYgMCAwMDkgMGwxMDEtMTAxYTYgNiAwIDAwMC05bC0yNC0yMy00LTJ6Ii8+PC9zdmc+)](https://renovatebot.com)

<p align="center">
  <img style="display: block; width: 100%; max-width: 700px" alt="CLI Screenshot" src="https://i.imgur.com/2N3YWHF.png">
</p>

## Installation

All you need is to install is node

```sh
$ npm i -g @nix2/nix-cli
```

## Usage

The basic command is `nix-cli` which if you are using the [zsh plugin](https://github.com/nix2io/cli-zsh-plugin) you are given an alias of `dev`.
The rest of the documentation uses `dev` but should be the same for `nix-cli`.

When running the command with no arguments, it will default to `dev info`.

### Help

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

### Cache

#### Clear

To clear all the cache use:

```sh
$ dev cache clear
```
