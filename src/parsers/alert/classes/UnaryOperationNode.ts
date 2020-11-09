/*
 * File: BinaryOperationNode.ts
 * Created: 10/26/2020 20:05:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
// Relationship specific
import { AlertNode, AlertRule } from '.';

export default class UnaryOperationNode implements AlertNode {
    constructor(public operationToken: Token, public node: AlertNode) {}

    run(_: AlertRule): void {
        throw Error('not implemented');
    }
}
