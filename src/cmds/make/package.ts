import * as commander from 'commander';
import colors = require('colors');
import { getServiceContext } from '../../service';
import { join } from 'path';
import { TypescriptServiceContext } from '../../classes';

export const pkg = (make: commander.Command): void => {
    make.command('package')
        .description('make a package.json')
        .action((options) => {
            // make sure there is a service context
            const serviceContext = getServiceContext(options);
            if (serviceContext == null)
                return console.error(colors.red('No service context found'));
            if (!(serviceContext instanceof TypescriptServiceContext)) {
                return console.error(colors.red('Not a typescript service'));
            }

            console.log(serviceContext.readPackageFile());

            const packagePath = join(process.cwd(), '/serv');
        });
};
