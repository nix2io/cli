export default class AlertRule {
    constructor(
        public name: string,
        public rules: AlertRule[] = [],
        public exclude: boolean = false,
        private _all: boolean = false,
    ) {}

    toString(): string {
        const str = `${this.name}`;

        let rls: string = this.rules.map((rule) => rule.toString()).join(',');
        if (rls != '') rls = '.' + rls;

        return str + rls;
    }

    get all(): boolean {
        return this._all;
    }

    setAll(state = true): AlertRule {
        this._all = state;
        return this;
    }

    addRule(rule: AlertRule): AlertRule {
        this.rules.push(rule);
        return this;
    }
}
