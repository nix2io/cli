import { CommanderStatic } from "commander";
import { VERSION, SERVICE_DISPLAY_TEMPLATE } from "../constants";
import { getServiceContext } from "../service";
import { formatString } from "../util";
import { authed, user } from '../user';
const colors = require('colors');
const emoji = require('node-emoji');
// const ora = require('ora');


export default (program: CommanderStatic) => {
    
    program
        .command('info')
        .description('display service context info')
        .action(() => {
            console.log(colors.bold('Nix2 CLI') + colors.grey(` v${VERSION}`));
            if (authed) {
                console.log(colors.cyan(`    ℹ Authed as ${user?.name}`))
            } else {
                console.log(colors.yellow('    ⚠ No user authed'))
            }
            // get the service
            try {
                let service = getServiceContext();
                if (service == null) {
                    console.log(colors.grey('No service in this directory'));
                    return;
                }
                const info = service.info;
                const devCount = service.info.getDevs().length;
                
                console.log(formatString(SERVICE_DISPLAY_TEMPLATE, {
                    label:       info.label,
                    identifier:  info.identifier,
                    description: info.description,
                    version:     info.version,
                    authorText:  `${devCount} dev${devCount != 1 ? 's' : ''}`
                }));

                

            } catch (err) {
                console.error(colors.red(`ERR: ${err.message}`));
            }

        });
    
}