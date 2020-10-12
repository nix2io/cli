import config from './config';


class User {
    constructor(
        public email: string,
        public name: string
    ) {}
}

const userObj = config.get('user');


export const authed = userObj != null;
export const user = module.exports.authed ? new User(userObj.email, userObj.name) : null;