import { CommanderStatic } from 'commander';
import gateway from './gateway';
import api from './api';


export default (program: CommanderStatic) => {
    
    let make = program.command('make').description('make things related to your service')

    // Apply all the functions to the program
    gateway(make);
    api(make);
    
}