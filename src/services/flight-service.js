const { StatusCodes } = require('http-status-codes'); 

const { FlightRepository } = require('../respositories');
const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try{ 
        const flight = await flightRepository.create(data);
        return flight;
    }
    catch(error){
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            let explanation = [];
            if (error.errors) {
                error.errors.forEach(err => {
                    explanation.push(err.message);
                });
            } else {
                explanation.push(error.message);
            }
            throw new AppError(explanation, StatusCodes.BAD_REQUEST )
        }

        console.log("REAL FLIGHT DB ERROR:", error);
        throw new AppError('Cannot create a new flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,

}