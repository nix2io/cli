import { CommanderStatic } from "commander";


export default (program: CommanderStatic) => {
    
    let make = program.command('make')

    make
        .command('api')
        .description('clone a repository into a newly created directory')
        .action(() => {
            console.log('creating api');
        });

    make
        .command('route')
        .action(() => {
            console.log('making a route');
            
        })
    
}