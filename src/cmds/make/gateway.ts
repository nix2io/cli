import * as commander  from "commander";

export default (make: commander.Command) => {
    
    make
        .command('gateway')
        .description('make a gateway')
        .action(() => {
            console.log('creating gateway');
        });   
}