const {StatusCodes} = require('http-status-codes');
const { AirplaneService } = require('../services');
const { ErrorResponse, SuccessResponse} = require('../utils/common');
const { error } = require('../utils/common/error-response');
 
async function createAirplane(req, res) {
    try {
        const airplane = await AirplaneService.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse)
    }
    catch(error){
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            // If you use an explanation array in AppError, add this too:
            explanation: error.explanation || [] 
        };
        return res
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse);
    }
}

async function getAirplanes(req, res){
    try {
        const airplanes = await AirplaneService.getAirplanes();
        SuccessResponse.data = airplanes;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            // If you use an explanation array in AppError, add this too:
            explanation: error.explanation || [] 
        };
        return res  
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse)
    }
}

async function getAirplane(req, res){
    try {
        const airplane = await AirplaneService.getAirplane(req.params.id);
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            // If you use an explanation array in AppError, add this too:
            explanation: error.explanation || [] 
        };
        return res  
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse)
    }
}

async function destroyAirplane(req, res){
    try {
        const airplane = await AirplaneService.destroyAirplane(req.params.id);
        SuccessResponse.data = airplane;
        return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = {
            message: error.message || 'An unexpected error occurred',
            // If you use an explanation array in AppError, add this too:
            explanation: error.explanation || [] 
        };
        return res  
                .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
                .json(ErrorResponse)
    }
}

module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane,destroyAirplane
}