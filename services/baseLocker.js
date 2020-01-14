'use strict';

module.exports = class BaseLocker {
    constructor() {
        if (this.constructor === BaseLocker)
            throw new Error("Can't instanciate instance of abstract class");
    }
    /**
    * Request to aquire lock
    * @param {String} resourceId Resource ID to aquire lock by
    * @param {Number} ttl Time to hold on the lock in msec
    * @returns {String} Returns resource ID on succes or null on failure
    */
    lock(resourceId, ttl = 500) {
        throw new Error("Calling abstract class functions are forbidden");
    }

    /**
     * Request to release a lock by resouce ID and token ID
     * @param {String} resourceId Resource ID to aquire lock by
     * @param {String} tokenId 
     * @returns {Promise<{result: Boolean, message : String}>} Returns object containing operation result and optional error message
     */
    unlock(resourceId, tokenId) {
        throw new Error("Calling abstract class functions are forbidden");
    }
}