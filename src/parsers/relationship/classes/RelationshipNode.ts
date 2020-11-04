import { CommandContext } from '.';
import { Node } from '../../shared/classes';

export default abstract class RelationshipNode extends Node {
    abstract run(_: CommandContext): string[];
}
