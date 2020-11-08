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
        /**
         * left  :  AlertNode("git")
         * op    :  index
         * right :  AlertNode("pr")
         *
         * AlertRuleName("git").addRule(AlertRuleName("pr"))
         *
         * *
         * AlertRule().all = true
         *
         *
         *
         */
        let leftNode = <NameNode>this.leftNode;
        // create the left node rule
        let left = new AlertRule(leftNode.token.value!);

        if (this.operationToken.type == TOKEN_INDEX) {
            let rightNode = <NameNode>this.rightNode;
            // create the right node rule
            let right = new AlertRule(rightNode.token.value!);
            left.addRule(right);
        } else if (this.operationToken.type == TOKEN_COMMA) {
            let rightNode = <NameNode>this.rightNode;
            // create the right node rule
            let right = new AlertRule(rightNode.token.value!);
            alertRule.addRule(right);
        }

        // add the new left rule to the parent rule
        alertRule.addRule(left);
    }
}
