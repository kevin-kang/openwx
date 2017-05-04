import fetch from 'node-fetch';

class KoaErr extends Error {
    constructor({ message = 'Error', status = 500 } = {}, ...args) {
        super();
        this.message = message;
        this.status = status;
        if (args.length > 0) {
            extend(this, args[0]);
        }
    }
}

let koafetch = (...args) => {
    return fetch.apply(null, args).then(function(res) {
        return res.text()
    });
};

export default { KoaErr: KoaErr,  proxy: koafetch};
