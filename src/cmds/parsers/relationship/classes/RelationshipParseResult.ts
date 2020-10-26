import { ParseResult } from '../../shared/classes';
import { CommandContext, RelationshipNode } from '.';
import { ParseError } from '../../shared/errors';

export default class RelationshipParseResult extends ParseResult {
    constructor(
        public error: ParseError | null = null,
        public node: RelationshipNode | null = null,
    ) {
        super();
    }

    createCommand() {
        let ctx = new CommandContext();
        if (this.node == null) throw Error('node is null');
        this.node.run(ctx);
        return ctx;
    }
}
