import { AlertRule } from '.';
import { Node } from '../../shared/classes';

/**
 * Base class for representing an Alert Node.
 * @class AlertNode
 * @abstract
 */
export default abstract class RelationshipNode extends Node {
    abstract run(_: AlertRule): void;
}
