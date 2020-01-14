const HttpCodes = require("http-status-codes");
const Locker = require("../services/inMemoryLocker");

const locker = new Locker();

module.exports.lock = async (request, response, next) => {
    let ttl = request.swagger.params.ttl.value;
    let resourceId = request.swagger.params.resourceId.value;

    try {
        let tokenId = await locker.lock(resourceId, ttl);

        if (!tokenId)
            _setResponse(response, HttpCodes.INTERNAL_SERVER_ERROR, "Failed to lock. Lock is in use.");
        else
            _setResponse(response, HttpCodes.OK, tokenId);

    } catch (error) {
        _setErrorResponse(response, error);
    }
}

module.exports.unlock = async (request, response, next) => {
    let tokenId = request.swagger.params.tokenId.value;
    let resourceId = request.swagger.params.resourceId.value;

    try {
        let result = await locker.unlock(resourceId, tokenId);

        if (!result.result || result.result == false)
            _setResponse(response, HttpCodes.INTERNAL_SERVER_ERROR, "Failed to unlock." + result.message);
        else
            _setResponse(response, HttpCodes.OK, result.result);

    } catch (error) {
        _setErrorResponse(response, error);
    }
}

function _setResponse(response, statusCode, value) {
    // Set status code, and end the request.
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(value));
}

function _setErrorResponse(response, error) {

    if (error instanceof TypeError) {
        // Set status code, and end the request.
        _setResponse(response, HttpCodes.BAD_REQUEST, error.message);
        return;
    }

    // Set status code, and end the request.
    _setResponse(response, HttpCodes.INTERNAL_SERVER_ERROR);
}