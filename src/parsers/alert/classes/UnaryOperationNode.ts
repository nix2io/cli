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

/**
 * Class for representing a unary operation node.
 * @class UnaryOperationNode
 */
export default class UnaryOperationNode implements AlertNode {
    /**
     * Constructor for a unary operation node.
     * @param {Token}     operationToken The type of operation token.
     * @param {AlertNode} node           The node that is getting affected.
     */
    constructor(public operationToken: Token, public node: AlertNode) {}

    /**
     * Runs the node.
     * @param {AlertRule} _ Alert rule.
     */
    run(_: AlertRule): void {
        throw Error('not implemented');
    }
}
