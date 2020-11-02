import { ParseResult } from '../../shared/classes';
import { ParseError } from '../../shared/errors';
import { AlertNode } from '.';

export default class AlertParseResult extends ParseResult {
    constructor(
        public error: ParseError | null = null,
        public node: AlertNode | null = null,
    ) {
        super();
    }
}
