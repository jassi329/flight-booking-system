const {StatusCodes} = require('http-status-codes');
const { AirplaneService } = require('../services');
const { response } = require('express');
const { error } = require('winston');

async function createAirplane(req, res) {
    try {
        console.log(req.body);
        const airplane = await AirplaneService.createAirplane({
            modelNumber: req.body.modelNumber,
            capacity: req.body.capacity
        });
        return res
                .status(StatusCodes.CREATED)
                .json({
                    success: true,
                    message: 'Successfully created an airplane',
                    data: response,
                    error: {}
                })
    }
    catch(error){
    console.error(error);   // <-- see actual error in terminal

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            success: false,
            message: 'something went wrong while creating airplane',
            data: {},
            error: error.message
        });
    }
}

module.exports = {
    createAirplane
}