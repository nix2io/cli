import * as commander from 'commander';

import { Service } from '@nix2/service-core';
import { makeCommand } from './makeFile';

export default (make: commander.Command): void => {
    makeCommand(make, 'readme', 'README.md', Service.prototype.createREADME);
};
