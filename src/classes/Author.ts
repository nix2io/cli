const flagInheritence = {
    dev: 'contributer',
    leadDev: 'dev'
};

export default class Author {
    constructor(
        public name: string,
        public email: string,
        public publicEmail: string,
        public url: string,
        public alert: string,
        public flags: Set<string>
    ) {
        this.updateFlags();
    };

    updateFlags() {
        let flags = this.flags;
        for (let flag of flags) {
            let currentFlag = flag;
            while (Object.keys(flagInheritence).indexOf(currentFlag) != -1) {
                // @ts-ignore
                currentFlag = flagInheritence[currentFlag];
                flags.add(currentFlag);
            }
        }
        this.flags = flags;
    }

}