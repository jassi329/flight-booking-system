const { StatusCodes } = require('http-status-codes'); 

const { AirplaneRepository } = require('../respositories');
const AppError = require('../utils/errors/app-error');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try{ 
        const airplane = await airplaneRepository.create(data);
        return airplane;
    }
    catch(error){
        if(error.name = 'TypeError') {
            throw new AppError('Cannot create a new Airplane object', StatusCodes.INTERNAL_SERVER_ERROR)
        }
        throw error;
    }
}

module.exports = {
    createAirplane
}