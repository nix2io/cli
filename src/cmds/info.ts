import { CommanderStatic } from "commander";
import { VERSION } from "../constants";
import { getServiceContext } from "../service";
const chalk = require('chalk');


export default (program: CommanderStatic) => {
    
    program
        .command('info')
        .action(() => {
            console.log(chalk.bold('Nix2 CLI version ' + VERSION));
            // get the service
            try {
                let service = getServiceContext();
                console.log(service);
                
                if (service == null) {
                    console.log(chalk.gray('No service in this directory'));
                    return;
                }
            } catch (err) {
                console.error(chalk.red(`ERR: ${err.message}`));
            }

        });
    
}