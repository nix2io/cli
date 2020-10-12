import { CommanderStatic } from "commander";
import cache from '../cache';
const colors = require('colors');
const ora = require('ora');


export default (program: CommanderStatic) => {
    
    let cacheCommand = program
        .command('cache')
        .description('manage your cache');

    cacheCommand.command('clearr', 'clear your cache')
        .action(() => {
            const spinner = ora("Clearing cache").start();
            cache.clear();
            spinner.stop();
            console.log(colors.green('Cache cleared'));
        });
}