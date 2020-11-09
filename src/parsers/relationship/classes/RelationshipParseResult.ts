import { ParseResult, Token } from '../../shared/classes';
import { ParseError } from '../../shared/errors';
import { CommandContext, RelationshipNode } from '.';

/**
 * Class for representing a relationship parse result.
 * @class RelationshipParseResult
 */
export default class RelationshipParseResult extends ParseResult {
    /**
     * Constructor for the `RelationshipParseResult` class.
     * @param {ParseError | null}       error Parse error if exists.
     * @param {RelationshipNode | null} node  Parse result relationship node if exists.
     */
    constructor(
        public error: ParseError | null = null,
        public node: RelationshipNode | null = null,
    ) {
        super();
    }

    /**
     * Create a command context from the parse result.
     * @function createCommand
     * @memberof ParseResult
     * @returns {CommandContext} The command context to create the schemas.
     */
    createCommand(): CommandContext {
        const ctx = new CommandContext();
        if (this.node == null) throw Error('node is null');
        this.node.run(ctx);
        return ctx;
    }

    /**
     * Register a result.
     * @function register
     * @memberof RelationshopParseResult
     * @param   {RelationshipParseResult | Token}     result The result to register.
     * @returns {RelationshipParseResult | RelationshopNode} The given result or node.
     */
    register(
        result: RelationshipParseResult | Token,
    ): RelationshipParseResult | RelationshipNode {
        return <RelationshipParseResult | RelationshipNode>(
            super.register(result)
        );
    }
}
