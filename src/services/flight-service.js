const { StatusCodes } = require('http-status-codes'); 

const { FlightRepository, AirportRepository } = require('../respositories');
const airportRepository = new AirportRepository();
const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();

async function createFlight(data) {
    try{ 

        const departureAirport = await airportRepository.getAirportByCode(data.departureAirportId);
        if (!departureAirport) {
            throw new AppError('Departure airport code not found', StatusCodes.NOT_FOUND);
        }

        // 3. Look up the Arrival Airport by its code (e.g., "del")
        const arrivalAirport = await airportRepository.getAirportByCode(data.arrivalAirportId);
        if (!arrivalAirport) {
            throw new AppError('Arrival airport code not found', StatusCodes.NOT_FOUND);
        }

        // 4. Overwrite the string codes with the real database Integer IDs!
        data.departureAirportId = departureAirport.id;
        data.arrivalAirportId = arrivalAirport.id;

        const flight = await flightRepository.create(data);
        return flight;
    }
    catch(error){
        if(error.StatusCode === StatusCodes.NOT_FOUND){
            throw error
        }
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

        console.log("REAL FLIGHT error", error);
        throw new AppError('Cannot create a new flight object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,

}