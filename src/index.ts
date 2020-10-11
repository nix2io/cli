#!/usr/bin/env node


require('./initalize').default();
import * as program from 'commander';
import * as cmds from './cmds';
import { VERSION } from './constants';


// Program info
program
    .name('nix-cli')
    .version(VERSION, '-v', 'output cli version');


// Apply all the functions to the program
for (let func of Object.values(cmds)) func(program);


// Show the info screen if no commands given
if (!process.argv.length) program.parse(['info']);


// Parse args
program.parse(process.argv);
