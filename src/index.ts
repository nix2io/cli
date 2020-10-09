import * as program from 'commander';
import * as cmds from './cmds';
import { VERSION } from './constants';


// Program info
program
    .name('nix-cli')
    .version(VERSION, '-v', 'output cli version');


// Apply all the functions to the program
let funcs = Object.values(cmds);
for (const func of funcs) func(program);


// Show the help screen if no commands given
if (!process.argv.length) program.parse(['info']);
program.parse(process.argv);