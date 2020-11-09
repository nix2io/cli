/**
 * Class for representing an alert rule.
 */
export default class AlertRule {
    /**
     * Constructor for an alert rule.
     * @param {string}      name    Rule name.
     * @param {AlertRule[]} rules   Implemented rules.
     * @param {boolean}     exclude If the rule is getting excluded.
     * @param {boolean}     _all    If the rule is using all of the parents rule's nodes.
     */
    constructor(
        public name: string,
        public rules: AlertRule[] = [],
        public exclude: boolean = false,
        private _all: boolean = false,
    ) {}

    /**
     * Convert the rule into a string.
     * @function toString
     * @memberof AlertRule
     * @returns {string} Rule as a string.
     */
    toString(): string {
        const str = `${this.name}`;

        let rls: string = this.rules.map((rule) => rule.toString()).join(',');
        if (rls != '') rls = '.' + rls;

        return str + rls;
    }

    /**
     * Getter for the all value.
     * @function all
     * @memberof AlertRule
     * @returns {boolean} The value of all.
     */
    get all(): boolean {
        return this._all;
    }

    /**
     * Set all to a state.
     * @function setAll
     * @memberof AlertRule
     * @param   {boolean} state State of all. Defaults to `true`.
     * @returns {AlertRule}     Returns itself.
     */
    setAll(state = true): AlertRule {
        this._all = state;
        return this;
    }

    /**
     * Adds a rule to the rule.
     * @function addRule
     * @memberof AlertRule
     * @param   {AlertRule} rule The alert rule to get added to the rule.
     * @returns {AlertRule}      Returns itself.
     */
    addRule(rule: AlertRule): AlertRule {
        this.rules.push(rule);
        return this;
    }
}
