/*
 * File: NameNode.ts
 * Created: 10/26/2020 20:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
import { AlertNode, AlertRule } from '.';

export default class NameNode implements AlertNode {
    constructor(public token: Token) {}

    run(_: AlertRule): void {
        throw Error('not implemented');
    }
}
