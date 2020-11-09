/*
 * File: BinaryOperationNode.ts
 * Created: 10/26/2020 20:05:00
 * ----
 * Copyright: 2020 Nix² Technologies
 * Author: Max Koon (maxk@nix2.io)
 */

import { Token } from '../../shared/classes';
// Relationship specific
import { AlertNode, AlertRule, NameNode } from '.';
import { TOKEN_INDEX, TOKEN_COMMA } from '../constants';

export default class BinaryOperationNode implements AlertNode {
    constructor(
        public leftNode: AlertNode,
        public operationToken: Token,
        public rightNode: AlertNode,
    ) {}

    run(alertRule: AlertRule): void {
        const leftNode = <NameNode>this.leftNode;
        // create the left node rule
        const left = new AlertRule(<string>leftNode.token.value);

        if (this.operationToken.type == TOKEN_INDEX) {
            const rightNode = <NameNode>this.rightNode;
            // create the right node rule
            const right = new AlertRule(<string>rightNode.token.value);
            left.addRule(right);
        } else if (this.operationToken.type == TOKEN_COMMA) {
            const rightNode = <NameNode>this.rightNode;
            // create the right node rule
            const right = new AlertRule(<string>rightNode.token.value);
            alertRule.addRule(right);
        }

        // add the new left rule to the parent rule
        alertRule.addRule(left);
    }
}
