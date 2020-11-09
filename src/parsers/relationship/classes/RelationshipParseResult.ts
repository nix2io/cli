import { ParseResult, Token } from '../../shared/classes';
import { ParseError } from '../../shared/errors';
import { CommandContext, RelationshipNode } from '.';

export default class RelationshipParseResult extends ParseResult {
    constructor(
        public error: ParseError | null = null,
        public node: RelationshipNode | null = null,
    ) {
        super();
    }

    createCommand(): CommandContext {
        const ctx = new CommandContext();
        if (this.node == null) throw Error('node is null');
        this.node.run(ctx);
        return ctx;
    }

    register(
        result: RelationshipParseResult | Token,
    ): RelationshipParseResult | RelationshipNode {
        return <RelationshipParseResult | RelationshipNode>(
            super.register(result)
        );
    }
}
