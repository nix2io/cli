const flagInheritence = {
    dev: 'contributer',
    leadDev: 'dev'
};

export default class Author {
    
    public inherited_flags: Set<string>;
    
    constructor(
        public email: string,
        public name: string,
        public publicEmail: string,
        public url: string,
        public alert: string,
        public flags: Set<string>
    ) {
        this.inherited_flags;
        this.updateFlags();
    };

    static deserialize(data: {[key: string]: any}) {
        return new Author(
            data.email,
            data.name || null,
            data.publicEmail || null,
            data.url || null,
            data.alert || 'none',
            new Set(data.flags)
        )
    }

    serialize() {
        return {
            email:       this.email,
            name:        this.name,
            publicEmail: this.publicEmail,
            url:         this.url,
            alert:       this.alert,
            flags:       Array.from(this.flags)
        }
    }

    updateFlags() {
        let flags = new Set(this.flags);
        for (let flag of flags) {
            let currentFlag = flag;
            while (Object.keys(flagInheritence).indexOf(currentFlag) != -1) {
                // @ts-ignore
                currentFlag = flagInheritence[currentFlag];
                flags.add(currentFlag);
            }
        }
        this.inherited_flags = flags;
    }

}