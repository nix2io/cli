import { CommandContext } from '.';
import { Node } from '../../shared/classes';

/**
 * Base class for representing a Relationship Node.
 * @class RelationshipNode
 * @abstract
 */
export default abstract class RelationshipNode extends Node {
    abstract run(_: CommandContext): string[];
}
