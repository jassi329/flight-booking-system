const { StatusCodes } = require('http-status-codes'); 
const { Op } = require('sequelize');
const { FlightRepository, AirportRepository } = require('../respositories');
const airportRepository = new AirportRepository();
const AppError = require('../utils/errors/app-error');

const flightRepository = new FlightRepository();

//utility
const { compareTime } = require('../utils/helpers/datetime-helper')

async function createFlight(data) {
    try{ 

        if (!compareTime(data.arrivalTime, data.departureTime)) {
            throw new AppError(
                'Arrival time must be strictly greater than departure time', 
                StatusCodes.BAD_REQUEST
            );
        }

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

async function getAllFlights(query) {
    let customFilter = {};
    const endingTripTime = "23:59:00"
    let sortFilter = [];
    //tripes = MUM-DEL
    if(query.trips){
        let [departureAirportCode, arrivalAirportCode] = query.trips.split("-");

        const departureAirport = await airportRepository.getAirportByCode(departureAirportCode);
        const arrivalAirport = await airportRepository.getAirportByCode(arrivalAirportCode);

        if (!departureAirport || !arrivalAirport) {
             throw new AppError('One or both airport codes are invalid', StatusCodes.BAD_REQUEST);
        }

        customFilter.departureAirportId = departureAirport.id;
        customFilter.arrivalAirportId = arrivalAirport.id;
        //TODO: addimg a check they do not same

    }
    if(query.price){
        let [minPrice, maxPrice] = query.price.split("-");
        customFilter.price = {
            [Op.between]: [minPrice, ((maxPrice == undefined) ? 20000: maxPrice)]
        }
    }
    if(query.travellers){
        customFilter.totalSeats = {
            [Op.gte]: query.travellers
        }
    }
    if(query.tripDate){
        customFilter.departureTime = {
            [Op.between]: [query.tripDate, query.tripDate + " " + endingTripTime]
        }
    }
    if(query.sort) {
        const params = query.sort.split(",");
        const sortFilters = params.map((params) => params.split('_'));
        sortFilter = sortFilters
    }
    try {
        const flights = await flightRepository.getAllFlights(customFilter, sortFilter);
        return flights;
    } catch (error) {
        if (error.statusCode === StatusCodes.BAD_REQUEST) {
            throw error;
        }
        throw new AppError('cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

async function getFlight(id) {
    try{
        const flight = await flightRepository.get(id);
        return flight;
    }catch(error){
        if(error.statusCode ==StatusCodes.NOT_FOUND){
            throw new AppError('The flight requested is not present', error.statusCode)
        }
        throw new AppError('cannot fetch data of all the flight', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
}