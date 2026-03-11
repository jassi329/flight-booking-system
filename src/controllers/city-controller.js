const {StatusCodes} = require('http-status-codes');
const { CityService } = require('../services');
const { ErrorResponse, SuccessResponse} = require('../utils/common');
const { error, success, message } = require('../utils/common/error-response');

async function createCity(req, res) {
    try {
        const city = await CityService.createCity({
            name: req.body.name
        });
        SuccessResponse.data = city;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse)
    }
    catch(error){
        ErrorResponse.error = error;
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json({
                    success:false,
                    message: "something went wrong",
                    error: error.message
                });
    }
}


module.exports = {
    createCity
}