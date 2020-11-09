/*
 * File: NameNode.ts
 * Created: 10/26/2020 20:03:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
import { AlertNode, AlertRule } from '.';

/**
 * Class for representing an alert name node.
 * @class AlertNameNode
 */
export default class AlertNameNode implements AlertNode {
    /**
     * Constructor for an alert name node.
     * @param {Token} token Token with the value of the alert name.
     */
    constructor(public token: Token) {}

    /**
     * Runs the node.
     * @function run
     * @memberof RelationshipNameNode
     * @param {AlertRUle} _ Alert rule.
     */
    run(_: AlertRule): void {
        throw Error('not implemented');
    }
}
