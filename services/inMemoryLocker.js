'use strict';

const { v4 } = require("node-uuid");
const BaseLocker = require("./baseLocker");

module.exports = class Locker extends BaseLocker {
    constructor() {
        super();
        this._dict = new Map();
    }
    /**
     * Request to aquire lock
     * @param {String} resourceId Resource ID to aquire lock by
     * @param {Number} ttl Time to hold on the lock in msec
     * @returns {String} Returns resource ID on succes or null on failure
     */
    lock(resourceId, ttl = 500) {
        return new Promise((resolve, reject) => {
            if (typeof resourceId !== "string")
                reject("(resourceId) must be of type string.");
            if (resourceId == "")
                reject("(resourceId) must not be empty.");

            if (this._dict.has(resourceId))
                resolve(null);

            let tokenId = v4();
            this._dict.set(resourceId, tokenId);

            resolve(tokenId);
        });
    }

    /**
     * Request to release a lock by resouce ID and token ID
     * @param {String} resourceId Resource ID to aquire lock by
     * @param {String} tokenId 
     * @returns {Promise<{result: Boolean, message : String}>} Returns object containing operation result and optional error message
     */
    unlock(resourceId, tokenId) {
        return new Promise((resolve, reject) => {
            if (typeof resourceId !== "string")
                reject("Parameter (resourceId) must be of type string.");
            if (resourceId == "")
                reject("(resourceId) must not be empty.");
            if (typeof tokenId !== 'string')
                reject("Parameter (tokenId) must be of type string.");
            if (tokenId == "")
                reject("(tokenId) must not be empty.");

            if (!this._dict.has(resourceId))
                resolve({ result: false, message: "(resourceId) does not exists" });

            if (this._dict.get(resourceId) !== tokenId)
                resolve({ result: false, message: "(resourceId) is not associated with (tokenId)" });

            if (!this._dict.delete(resourceId))
                resolve({ result: false, message: "Unable to release the lock" });

            resolve({ result: true });
        });
    }
}