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

Nix2 CLI Version:  1.0.1
Service:           main-bridge
Type:              gateway
Status:            in dev

```


