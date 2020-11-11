import * as commander from 'commander';
import { TypescriptServiceContext } from '../../classes';
import { makeCommand } from './makeFile';

export default (make: commander.Command): void => {
    makeCommand(
        make,
        ['eslint', 'eslintrc'],
        '.eslintrc.json',
        TypescriptServiceContext.prototype.createESLintConfig,
    );
};
