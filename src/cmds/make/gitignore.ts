import * as commander from 'commander';
import { ServiceContext } from '../../classes';
import { makeCommand } from './makeFile';

export default (make: commander.Command): void => {
    makeCommand(
        make,
        'gitignore',
        '.gitignore',
        ServiceContext.prototype.createGitIgnore,
    );
};
