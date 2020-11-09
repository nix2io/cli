import { ParseResult } from '../../shared/classes';
import { ParseError } from '../../shared/errors';
import { AlertNode } from '.';

/**
 * Class that represents an alert parse result.
 * @class AlertParseResult
 */
export default class AlertParseResult extends ParseResult {
    /**
     * Constructor for the `AlertParseResult` class.
     * @param {ParseError | null}  error Parse error if exists.
     * @param {AlertNode | null}   node  Parse result alert node if exists.
     */
    constructor(
        public error: ParseError | null = null,
        public node: AlertNode | null = null,
    ) {
        super();
    }
}
